import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://dasyl.seniorcub.name.ng';

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <h2 className="section__title" style={{ marginBottom: 'var(--space-4)' }}>Session Expired</h2>
        <p className="section__subtitle" style={{ marginBottom: 'var(--space-8)' }}>Please log in again to access your dashboard.</p>
        <button onClick={handleLogout} className="btn btn--primary">
          Back to Login
        </button>
      </div>
    );
  }

  const { user, subscription } = data;

  return (
    <>
      <header className="site-header">
        <nav className="nav container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a href="#" className="nav__logo" style={{ pointerEvents: 'none' }}>
            <span className="logo-text">dasyl</span>
            <span className="logo-badge">{subscription.tier === 'pro' ? 'PRO' : 'CLI'}</span>
          </a>
          <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{user.email}</span>
            <button onClick={handleLogout} className="btn btn--outline btn--sm">
              Log Out
            </button>
          </div>
        </nav>
      </header>

      <main style={{ paddingBottom: 'var(--space-24)' }}>
        <section className="hero" style={{ padding: 'var(--space-12) 0', minHeight: 'auto', display: 'block' }}>
          <div className="container hero__inner" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="section__header" style={{ textAlign: 'left', marginBottom: 'var(--space-12)', maxWidth: '800px', marginInline: '0' }}>
              <p className="hero__eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Dashboard</p>
              <h1 className="hero__title" style={{ fontSize: '3.5rem' }}>
                Welcome back,<br /><span className="gradient-text">Developer.</span>
              </h1>
              <p className="hero__desc" style={{ marginTop: 'var(--space-4)' }}>
                Here is your project scaffolding and runtime intelligence overview.
              </p>
            </div>
            
            <div className="features__grid" style={{ width: '100%', marginBottom: 'var(--space-12)' }}>
              
              <article className="feature-card">
                <div className="feature-card__icon" style={{ color: 'var(--color-primary)' }}>[>]</div>
                <h3>Monthly Scaffolds</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-text)', lineHeight: 1 }}>{subscription.buildsThisMonth}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>/ {subscription.buildLimit} limit</span>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-card__icon" style={{ color: 'var(--color-yellow)' }}>[!]</div>
                <h3>Activity Streak</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-text)', lineHeight: 1 }}>{user.streak}</span>
                  <span style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Days</span>
                </div>
              </article>

              <article className="feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="feature-card__icon" style={{ color: 'var(--color-green)' }}>[#]</div>
                <h3>Runtime Intelligence</h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 'var(--space-4)', padding: 'var(--space-4)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius)' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No Active Telemetry.<br/>Run a Dasyl scaffolding command to see live metrics.</p>
                </div>
              </article>

            </div>

            <div style={{ width: '100%', maxWidth: '800px' }}>
              <div className="section__header" style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
                <h2 className="section__title" style={{ fontSize: '2rem' }}>CLI Integration</h2>
                <p className="section__subtitle" style={{ marginTop: 'var(--space-2)' }}>
                  Authenticate your local terminal to securely push telemetry data and unlock templates.
                </p>
              </div>

              <div className="terminal terminal--static" style={{ width: '100%' }}>
                <div className="terminal__bar">
                  <span className="dot dot--red"></span>
                  <span className="dot dot--yellow"></span>
                  <span className="dot dot--green"></span>
                  <span className="terminal__title">bash</span>
                </div>
                <div className="terminal__body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cmd">dasyl login</span>
                  </div>

                  <div>
                    <p style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Your API Token</p>
                    <div className="terminal-line" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ color: 'var(--color-green)', fontFamily: 'var(--font-mono)' }}>{user.apiToken}</span>
                      <button 
                        onClick={() => copyToClipboard(user.apiToken)}
                        className={copied ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        </section>
      </main>

      <footer className="site-footer" style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--space-8) 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-muted)' }}>
          <p>© 2026 Dasyl Engine. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
