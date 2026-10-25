import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState('resident');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/register`, {
        role,
        username,
        password,
        name: fullName,
        phone: phone || null,
        email: email || null,
        address: address || null,
      });

      const data = res.data;
      setMessage(data.message);

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        'Registration failed. Username may be taken.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="modal-content fade-in">
        <h2>Create Account</h2>

        {message && (
          <p
            style={{
              color: success ? '#22c55e' : '#f87171',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="resident">Citizen</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
          <div className="flex">
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
          />

          <div className="flex" style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p>Already have an account?</p>
          <Link to="/login" className="btn secondary w-full">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;