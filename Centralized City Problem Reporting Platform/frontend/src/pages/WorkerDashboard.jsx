import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function WorkerDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/data`);
      const myTasks = res.data.requests.filter(r => r.assigned_worker_id === currentUser?.id);
      setTasks(myTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'worker') {
      navigate('/login');
      return;
    }

    fetchTasks();
  }, [currentUser, navigate, fetchTasks]);

  const handleCompleteTask = async (taskId) => {
    if (!window.confirm('Mark this task as completed?')) return;
    try {
      await axios.post(`${API_URL}/work-complete`, { requestId: taskId });
      alert('Task marked as completed!');
      fetchTasks(); 
    } catch (err) {
      alert('Failed to complete task');
      console.error(err);
    }
  };

  const renderStatus = (status) => {
    const colors = { Pending: '#f59e0b', Assigned: '#3b82f6', Completed: '#22c55e' };
    return <span className="chip" style={{ background: colors[status] || '#6b7280' }}>{status}</span>;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h3>Worker</h3>
        <button className="btn secondary w-full" style={{ marginTop: 'auto' }} onClick={() => { logout(); navigate('/'); }}>
          Logout
        </button>
      </aside>

      <main className="main">
        <header className="flex justify-between items-center mb-6">
          <h1>
            Hello, <span>{currentUser?.name || 'Worker'}</span>
          </h1>
          <Link to="raise-complaint" className="btn secondary">
            Raise Complaint
          </Link>
        </header>

        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p style={{ color: '#f87171' }}>{error}</p>
        ) : tasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3>{task.type || 'Untitled Task'}</h3>
                  {renderStatus(task.status)}
                </div>
                <p className="text-muted mb-3">{task.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted">
                    Assigned: {new Date(task.created_at).toLocaleDateString()}
                  </div>
                  {task.status === 'Assigned' && (
                    <button className="btn small-btn" onClick={() => handleCompleteTask(task.id)}>
                      Task is Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkerDashboard;