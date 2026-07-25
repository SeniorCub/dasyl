import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Inherit base styles

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      // In production, we should use the actual API URL. 
      // For local development with Vite proxy (if set up), this works.
      // We will assume the API is running on https://dasyl.seniorcub.name.ng or local proxy
      const API_URL = import.meta.env.VITE_API_URL || 'https://dasyl.seniorcub.name.ng';
      
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          {isRegister ? 'Create Dasyl Account' : 'Welcome Back'}
        </h2>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              marginTop: '1rem',
              padding: '0.75rem', 
              borderRadius: '6px', 
              backgroundColor: '#3b82f6', 
              color: '#fff', 
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
          {isRegister ? 'Already have an account?' : 'Need an account?'}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
