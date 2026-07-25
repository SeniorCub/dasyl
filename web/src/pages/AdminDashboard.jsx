import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://dasyl.seniorcub.name.ng';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  if (isLoading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Loading admin dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem', padding: '2rem' }}>
        <h2 style={{ color: '#ef4444' }}>Access Denied</h2>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>You must be an admin to view this page.</p>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1.5rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '2rem' }}>
      <header style={{ maxWidth: '1000px', margin: '0 auto 2rem auto', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dasyl Admin Console</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>System-wide metrics and user monitoring</p>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
          Back to App
        </button>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Top Level Metrics */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Users</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#38bdf8' }}>{data.totalUsers}</p>
          </div>
          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Subscriptions</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#34d399' }}>{data.totalSubscriptions}</p>
          </div>
          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Builds (This Month)</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fbbf24' }}>{data.totalBuildsThisMonth}</p>
          </div>
        </section>

        {/* Top Users Table */}
        <section style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>Top 10 Most Active Users</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Email</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Role</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Score</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Streak</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.topUsers.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '0.75rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', backgroundColor: u.role === 'admin' ? '#ef4444' : '#334155' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#c084fc', fontWeight: 'bold' }}>{u.score}</td>
                    <td style={{ padding: '0.75rem', color: '#fbbf24' }}>{u.streak}</td>
                    <td style={{ padding: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
