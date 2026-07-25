import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 

const API_URL = import.meta.env.VITE_API_URL || 'https://dasyl.seniorcub.name.ng';

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
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `${API_URL}/api/oauth/${provider}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2.5rem 2rem', backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 'bold' }}>
          {isRegister ? 'Join Dasyl' : 'Welcome Back'}
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem' }}>
          {isRegister ? 'Start scaffolding projects faster.' : 'Log in to view your dashboard.'}
        </p>
        
        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => handleOAuth('github')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#24292e', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/></svg>
            Continue with GitHub
          </button>
          
          <button 
            onClick={() => handleOAuth('google')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#fff', color: '#1e293b', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
          <span style={{ padding: '0 0.75rem', color: '#64748b', fontSize: '0.875rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              marginTop: '0.5rem',
              padding: '0.75rem', 
              borderRadius: '8px', 
              backgroundColor: '#3b82f6', 
              color: '#fff', 
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'
            }}
          >
            {isRegister ? 'Sign Up with Email' : 'Log In with Email'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: '500' }}
          >
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
