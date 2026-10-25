import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function RaiseComplaint() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('workerId', currentUser.id);
      formData.append('description', desc.trim());
      if (file) formData.append('attachment', file);

      const res = await axios.post(`${API_URL}/complaint`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setMessage('Complaint raised successfully!');
        setTimeout(() => navigate('/worker-dashboard'), 1500);
      }
    } catch (err) {
      setError('Failed to raise complaint');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main" style={{ padding: '2rem' }}>
      <h2>Raise Complaint</h2>

      {message && <p style={{ color: '#22c55e' }}>{message}</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe the issue..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={5}
          required
          disabled={loading}
        />
        <label style={{ display: 'block', margin: '1rem 0 0.5rem' }}>
          Attach Photo/Video (optional):
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={e => setFile(e.target.files[0])}
          disabled={loading}
        />
        <div className="flex mt-4 gap-3">
          <button type="submit" className="btn w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Complaint'}
          </button>
          <button type="button" className="btn secondary w-full" onClick={() => navigate('/worker-dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default RaiseComplaint;