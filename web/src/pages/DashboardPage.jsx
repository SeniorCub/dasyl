import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTerminal, FaCode, FaFireAlt, FaCopy, FaCheckCircle, FaUserCircle, FaSignOutAlt, FaRocket } from 'react-icons/fa';
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
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="loader"></div>
        <style>{`
          .loader {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: var(--color-primary);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <FaSignOutAlt size={48} style={{ color: 'var(--color-primary)' }} className="mb-4" />
        <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>Please log in again to access your dashboard.</p>
        <button onClick={handleLogout} className="btn btn--primary">
          Back to Login
        </button>
      </div>
    );
  }

  const { user, subscription } = data;
  const progressPercent = Math.min((subscription.buildsThisMonth / subscription.buildLimit) * 100, 100);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      
      {/* Top Navigation */}
      <nav style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(13, 13, 13, 0.8)', backdropFilter: 'blur(10px)' }} className="sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <FaTerminal className="text-white text-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight">dasyl</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
              <FaUserCircle size={16} />
              {user.email}
            </div>
            <button 
              onClick={handleLogout} 
              className="transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        
        {/* Welcome Hero */}
        <header className="mb-10 animate-fade-in-up">
          <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</p>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1 mb-2">
            Welcome back, Developer.
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-lg">Here is your project scaffolding and runtime intelligence overview.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Stats) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Usage Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Builds Card */}
              <div className="p-6 rounded-xl border relative overflow-hidden group" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
                <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform duration-500 text-white">
                  <FaRocket size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded border" style={{ backgroundColor: 'rgba(255, 34, 0, 0.1)', borderColor: 'rgba(255, 34, 0, 0.2)', color: 'var(--color-primary)' }}>
                    <FaCode size={18} />
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Monthly Scaffolds</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black">{subscription.buildsThisMonth}</span>
                  <span className="font-medium" style={{ color: 'var(--color-text-dim)' }}>/ {subscription.buildLimit} limit</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                  <div 
                    className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-primary)', boxShadow: '0 0 10px rgba(255,34,0,0.5)' }}
                  ></div>
                </div>
              </div>

              {/* Streak Card */}
              <div className="p-6 rounded-xl border relative overflow-hidden group" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
                <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:rotate-12 transition-transform duration-500 text-white">
                  <FaFireAlt size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded border" style={{ backgroundColor: 'rgba(255, 204, 0, 0.1)', borderColor: 'rgba(255, 204, 0, 0.2)', color: 'var(--color-yellow)' }}>
                    <FaFireAlt size={18} />
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Activity Streak</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black drop-shadow-md">{user.streak}</span>
                  <span className="font-medium uppercase tracking-wider text-sm" style={{ color: 'var(--color-text-dim)' }}>Days</span>
                </div>
                <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>Scaffold consistently to maintain your developer streak!</p>
              </div>

            </div>

            {/* Quick Setup / CLI */}
            <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <FaTerminal style={{ color: 'var(--color-primary)' }} /> CLI Integration
              </h3>
              <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>Authenticate your local terminal to securely push telemetry data and unlock premium templates.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded border font-mono text-sm relative group" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <div className="select-none" style={{ color: 'var(--color-text-dim)' }}>$</div>
                  <div style={{ color: 'var(--color-green)' }} className="flex-1">dasyl login</div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-dim)' }}>Your API Token</label>
                  <div className="flex items-center gap-2 p-2 pl-4 rounded border relative transition-all" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.apiToken} 
                      className="bg-transparent border-none outline-none flex-1 font-mono text-sm tracking-wider"
                      style={{ color: 'var(--color-text)' }}
                    />
                    <button 
                      onClick={() => copyToClipboard(user.apiToken)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-200`}
                      style={{ 
                        backgroundColor: copied ? 'rgba(0, 255, 136, 0.1)' : 'var(--color-bg-elevated)', 
                        color: copied ? 'var(--color-green)' : 'var(--color-text)', 
                        border: `1px solid ${copied ? 'rgba(0, 255, 136, 0.3)' : 'var(--color-border)'}` 
                      }}
                    >
                      {copied ? <><FaCheckCircle /> Copied</> : <><FaCopy /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Info/Pulse) */}
          <div className="flex flex-col gap-6">
            <div className="p-6 rounded-xl border h-full flex flex-col" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                Runtime Intelligence
              </h3>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded" style={{ borderColor: 'var(--color-border)' }}>
                <FaSignOutAlt className="mb-4 rotate-90" size={40} style={{ color: 'var(--color-text-dim)' }} />
                <h4 className="font-medium mb-2">No Active Telemetry</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Run a Dasyl scaffolding command or install the Pulse Extension to see live metrics here.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Minimalistic Footer */}
      <footer className="mt-12 py-8" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: 'var(--color-text-dim)' }}>
          <p>© 2026 Dasyl Engine. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" style={{ color: 'var(--color-text-dim)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-dim)'} className="transition">Privacy Policy</a>
            <a href="/terms" style={{ color: 'var(--color-text-dim)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-dim)'} className="transition">Terms of Service</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
