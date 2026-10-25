import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function ResidentDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/data`);
      const myRequests = res.data.requests.filter(req => req.resident_id === currentUser?.id);
      setRequests(myRequests);
    } catch (err) {
      setError('Failed to load requests');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'resident') {
      navigate('/login');
      return;
    }

    const nameHeader = document.getElementById('resident-name-header');
    if (nameHeader) {
      nameHeader.textContent = currentUser.name || 'Citizen';
    }

    fetchRequests();
  }, [currentUser, navigate, fetchRequests]);

  const renderStatus = (status) => {
    const colors = {
      Pending: '#f59e0b',
      Assigned: '#3b82f6',
      Completed: '#22c55e',
    };
    return <span className="chip" style={{ background: colors[status] || '#6b7280' }}>{status}</span>;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h3>Citizen</h3>
        <button className="btn secondary w-full" style={{ marginTop: 'auto' }} onClick={() => { logout(); navigate('/'); }}>
          Logout
        </button>
      </aside>

      <main className="main">
        <header className="flex justify-between items-center mb-6">
          <h1>
            Hello, <span id="resident-name-header">{currentUser?.name || 'Citizen'}</span>
          </h1>
          <Link to="new-request" className="btn">
            New Request
          </Link>
        </header>

        {loading ? (
          <p className="text-muted">Loading your requests...</p>
        ) : error ? (
          <p style={{ color: '#f87171' }}>{error}</p>
        ) : requests.length === 0 ? (
          <div className="text-center text-muted py-8">
            <p>No requests submitted yet.</p>
            <Link to="new-request" className="btn mt-4 inline-block">
              Raise Your First Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{req.type || 'Untitled Request'}</h3>
                  {renderStatus(req.status)}
                </div>
                <p className="text-muted mb-3">{req.description || 'No description provided'}</p>
                <div className="text-sm text-muted">
                  Submitted: {new Date(req.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ResidentDashboard;