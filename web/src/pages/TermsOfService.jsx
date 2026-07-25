import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '2rem' }}>
      <header style={{ maxWidth: '800px', margin: '0 auto 2rem auto', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Terms of Service</h1>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
          Back to Home
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', color: '#cbd5e1' }}>
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
        <p>By downloading, installing, or using the Dasyl CLI and its associated services, you agree to be bound by these Terms of Service. If you do not agree, do not use the tool.</p>
        
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the CLI tool for personal or commercial scaffolding. This is the grant of a license, not a transfer of title.</p>
        
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>3. Fair Usage Policy</h2>
        <p>Accounts on the "Free" tier are limited to a specific number of builds per month. Attempts to bypass these limits via automated scripts or multiple accounts may result in suspension.</p>
        
        <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem' }}>4. Disclaimer</h2>
        <p>The materials provided by Dasyl are provided on an 'as is' basis. Dasyl makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>

        <p style={{ marginTop: '3rem', color: '#64748b', fontSize: '0.875rem' }}>Last updated: July 2026</p>
      </main>
    </div>
  );
}
