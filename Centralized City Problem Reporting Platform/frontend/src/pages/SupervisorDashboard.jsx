import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function SupervisorDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    residents: [],
    workers: [],
    requests: [],
    complaints: [],
    pendingResidents: [],
    pendingWorkers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('dash'); 

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    if (currentUser?.role !== 'supervisor') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [currentUser, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/data`);
      setData(res.data);
    } catch (err) {
      setError('Failed to load data. Check backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, role) => {
    if (!window.confirm(`Approve this ${role}?`)) return;
    try {
      await axios.post(`${API_URL}/approve`, { id, role });
      alert('Approved!');
      fetchData();
    } catch (_err) { 
      console.error(_err);
      alert('Approve failed');
    }
  };

  const handleRemove = async (id, role) => {
    if (!window.confirm(`Remove this ${role}?`)) return;
    try {
      await axios.post(`${API_URL}/delete-user`, { id, role });
      alert('Removed!');
      fetchData();
    } catch (_err) { 
      console.error(_err);
      alert('Remove failed');
    }
  };

  const openAssign = (requestId) => {
    setSelectedRequestId(requestId);
    setAssignModalOpen(true);
  };

  const confirmAssign = async () => {
    const workerId = document.getElementById('worker-select')?.value;
    if (!workerId) return alert('Select a worker');

    try {
      await axios.post(`${API_URL}/assign`, {
        requestId: selectedRequestId,
        workerId,
      });
      alert('Assigned!');
      setAssignModalOpen(false);
      fetchData();
    } catch (_err) { 
      alert('Assign failed');
      console.error(_err);
    }
  };

  const renderView = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: '#f87171' }}>{error}</p>;

    if (activeView === 'dash') {
      return (
        <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div className="card">
            <h3>Incoming Requests</h3>
            <table id="requests-table">
              <thead>
                <tr>
                  <th>Citizen</th>
                  <th>Type</th>
                  <th>Worker</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.requests.map((req) => {
                  const citizen = data.residents.find(r => r.id === req.resident_id);
                  const worker = data.workers.find(w => w.id === req.assigned_worker_id);
                  return (
                    <tr key={req.id}>
                      <td>{citizen?.full_name || 'Unknown'}</td>
                      <td>{req.type}</td>
                      <td>{worker ? worker.full_name : 'Unassigned'}</td>
                      <td>
                        {!worker ? (
                          <button className="btn small-btn" onClick={() => openAssign(req.id)}>
                            Assign
                          </button>
                        ) : (
                          <span className="chip">{req.status}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>Worker Complaints</h3>
            <div id="complaints-list">
              {data.complaints.length === 0 ? (
                <p>No complaints yet.</p>
              ) : (
                data.complaints.map((c) => (
                  <div key={c.id} className="card mb-2" style={{ borderLeft: '3px solid crimson' }}>
                    <div className="flex justify-between">
                      <strong>{c.worker_name}</strong>
                      <small>{new Date(c.created_at).toLocaleDateString()}</small>
                    </div>
                    <p>{c.description}</p>
                    {c.attachment && (
                      <a href={`${API_URL.replace('/api', '')}/uploads/${c.attachment}`} target="_blank">
                        View File
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeView === 'res') {
      return (
        <div className="card">
          <h3>Citizens</h3>
          <table id="residents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.residents.map((cit) => (
                <tr key={cit.id}>
                  <td>{cit.full_name}</td>
                  <td>{cit.phone || '-'}</td>
                  <td>{cit.address || '-'}</td>
                  <td>
                    <button
                      className="btn small-btn secondary del-user"
                      onClick={() => handleRemove(cit.id, 'resident')}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeView === 'work') {
      return (
        <div className="card">
          <h3>Workers</h3>
          <table id="workers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.workers.map((w) => (
                <tr key={w.id}>
                  <td>{w.full_name}</td>
                  <td>{w.phone || '-'}</td>
                  <td>{w.performance_score ||0 }</td>
                  <td>
                    <button
                      className="btn small-btn secondary del-user"
                      onClick={() => handleRemove(w.id, 'worker')}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeView === 'app') {
      return (
        <div>
          <h3>Pending Approvals</h3>
          <div id="approvals-list">
            {data.pendingResidents.length + data.pendingWorkers.length === 0 ? (
              <p>No pending approvals.</p>
            ) : (
              <>
                {data.pendingResidents.map((p) => (
                  <div key={p.id} className="card mb-2 flex justify-between items-center">
                    <div>
                      <b>{p.full_name}</b> <span className="chip">Citizen</span><br />
                      <small>{p.email || p.phone || '-'}</small>
                    </div>
                    <button className="btn small-btn approve-btn" onClick={() => handleApprove(p.id, 'resident')}>
                      Approve
                    </button>
                  </div>
                ))}

                {data.pendingWorkers.map((p) => (
                  <div key={p.id} className="card mb-2 flex justify-between items-center">
                    <div>
                      <b>{p.full_name}</b> <span className="chip">Worker</span><br />
                      <small>{p.email || p.phone || '-'}</small>
                    </div>
                    <button className="btn small-btn approve-btn" onClick={() => handleApprove(p.id, 'worker')}>
                      Approve
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h3>Supervisor</h3>
        <nav>
          <a
            href="#"
            className={`nav-link ${activeView === 'dash' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView('dash'); }}
          >
            Dashboard
          </a>
          <a
            href="#"
            className={`nav-link ${activeView === 'res' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView('res'); }}
          >
            Citizens
          </a>
          <a
            href="#"
            className={`nav-link ${activeView === 'work' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView('work'); }}
          >
            Workers
          </a>
          <a
            href="#"
            className={`nav-link ${activeView === 'app' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView('app'); }}
          >
            Approvals
          </a>
        </nav>
        <button
          className="btn secondary w-full"
          style={{ marginTop: 'auto' }}
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Logout
        </button>
      </aside>

      <main className="main">
        <header>
          <h1>Welcome, <span id="supervisor-name">{currentUser?.name || 'Admin'}</span></h1>
        </header>

        <div className={`view-section ${activeView === 'dash' ? 'active-view fade-in' : ''}`}>
          {renderView()}
        </div>
        <div className={`view-section ${activeView === 'res' ? 'active-view fade-in' : ''}`}>
          {renderView()}
        </div>
        <div className={`view-section ${activeView === 'work' ? 'active-view fade-in' : ''}`}>
          {renderView()}
        </div>
        <div className={`view-section ${activeView === 'app' ? 'active-view fade-in' : ''}`}>
          {renderView()}
        </div>
      </main>

      {assignModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Worker</h3>
            <select id="worker-select">
              <option value="">Select Worker...</option>
              {data.workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.full_name} (Score: {w.performance_score || 0})
                </option>
              ))}
            </select>
            <div className="flex mt-2">
              <button className="btn w-full" onClick={confirmAssign}>
                Assign
              </button>
              <button className="btn secondary w-full" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupervisorDashboard;