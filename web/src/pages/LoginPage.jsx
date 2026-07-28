import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import '../styles.css'; 

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {

  const handleOAuth = (provider) => {
    window.location.href = `${API_URL}/api/oauth/${provider}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2.5rem 2rem', backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 'bold' }}>
          Welcome to Dasyl
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2.5rem' }}>
          Log in or sign up to access your developer dashboard.
        </p>
        
        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={() => handleOAuth('github')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: '8px', backgroundColor: '#24292e', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <FaGithub size={20} />
            Continue with GitHub
          </button>
          
          <button 
            onClick={() => handleOAuth('google')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: '8px', backgroundColor: '#fff', color: '#1e293b', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.75rem' }}>
          By continuing, you agree to our <a href="/terms" style={{ color: '#94a3b8' }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#94a3b8' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
