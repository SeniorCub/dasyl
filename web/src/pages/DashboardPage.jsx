import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://dasyl.seniorcub.name.ng';

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (isLoading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>
        <p>Error loading dashboard. Please log in again.</p>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}>
          Back to Login
        </button>
      </div>
    );
  }

  const { user, subscription } = data;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 3rem auto', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dasyl Dashboard</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
          Log Out
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* API Token Section */}
        <section style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your API Token</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Run <code>dasyl login</code> in your terminal and paste this token to link your CLI.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              readOnly 
              value={user.apiToken} 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#34d399', fontFamily: 'monospace' }}
            />
            <button 
              onClick={() => copyToClipboard(user.apiToken)}
              style={{ padding: '0 1rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Copy
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Builds This Month</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {subscription.buildsThisMonth} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ {subscription.buildLimit}</span>
            </p>
          </div>
          
          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fbbf24' }}>
              {user.streak} <span style={{ fontSize: '1rem', color: '#64748b' }}>days</span>
            </p>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leaderboard Score</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#c084fc' }}>
              {user.score} <span style={{ fontSize: '1rem', color: '#64748b' }}>pts</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
