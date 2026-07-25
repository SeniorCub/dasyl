import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '2rem' }}>
      <header style={{ maxWidth: '800px', margin: '0 auto 2rem auto', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Privacy Policy</h1>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
          Back to Home
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', color: '#cbd5e1' }}>
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
        <p>When you use the Dasyl CLI and Dashboard, we collect your email address, basic profile information (if using OAuth), and telemetry data regarding the scaffolding commands you execute.</p>
        
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
        <p>We use your information to track your usage limits (builds per month), calculate your position on the global leaderboard, and improve the underlying scaffolding engine. We do not sell your data.</p>
        
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Storage & Security</h2>
        <p>Your data is securely stored in our cloud infrastructure. Passwords are cryptographically hashed, and API access is secured via JSON Web Tokens.</p>
        
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>4. Changes to this Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

        <p style={{ marginTop: '3rem', color: '#64748b', fontSize: '0.875rem' }}>Last updated: July 2026</p>
      </main>
    </div>
  );
}
