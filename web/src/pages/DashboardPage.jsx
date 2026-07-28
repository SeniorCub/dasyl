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
      <div className="flex items-center justify-center min-h-screen bg-[#030712]">
        <div className="loader"></div>
        <style>{`
          .loader {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: #3b82f6;
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030712] text-white">
        <FaSignOutAlt size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
        <p className="text-slate-400 mb-6">Please log in again to access your dashboard.</p>
        <button onClick={handleLogout} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-full font-medium">
          Back to Login
        </button>
      </div>
    );
  }

  const { user, subscription } = data;
  const progressPercent = Math.min((subscription.buildsThisMonth / subscription.buildLimit) * 100, 100);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/60 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FaTerminal className="text-white text-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Dasyl</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <FaUserCircle className="text-slate-300" size={16} />
              {user.email}
            </div>
            <button 
              onClick={handleLogout} 
              className="text-slate-400 hover:text-white transition-colors"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Welcome Hero */}
        <header className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Developer</span>
          </h1>
          <p className="text-slate-400 text-lg">Here is your project scaffolding and runtime intelligence overview.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Stats) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Usage Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Builds Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700/50 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                  <FaRocket size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                    <FaCode size={18} />
                  </div>
                  <h3 className="font-semibold text-slate-300">Monthly Scaffolds</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black text-white">{subscription.buildsThisMonth}</span>
                  <span className="text-slate-500 font-medium">/ {subscription.buildLimit} limit</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Streak Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700/50 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:rotate-12 transition-transform duration-500">
                  <FaFireAlt size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20 text-orange-400">
                    <FaFireAlt size={18} />
                  </div>
                  <h3 className="font-semibold text-slate-300">Activity Streak</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white drop-shadow-md">{user.streak}</span>
                  <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">Days</span>
                </div>
                <p className="mt-4 text-sm text-slate-400">Scaffold consistently to maintain your developer streak!</p>
              </div>

            </div>

            {/* Quick Setup / CLI */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] p-8 rounded-2xl border border-slate-800 shadow-2xl">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <FaTerminal className="text-blue-500" /> CLI Integration
              </h3>
              <p className="text-slate-400 mb-6 text-sm">Authenticate your local terminal to securely push telemetry data and unlock premium templates.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-black/50 p-4 rounded-xl border border-slate-800/80 font-mono text-sm relative group">
                  <div className="text-slate-500 select-none">$</div>
                  <div className="text-emerald-400 flex-1">dasyl login</div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-500">Your API Token</label>
                  <div className="flex items-center gap-2 bg-black/50 p-2 pl-4 rounded-xl border border-slate-800/80 relative transition-all focus-within:border-blue-500/50">
                    <input 
                      type="text" 
                      readOnly 
                      value={user.apiToken} 
                      className="bg-transparent border-none outline-none flex-1 font-mono text-sm text-slate-300 tracking-wider"
                    />
                    <button 
                      onClick={() => copyToClipboard(user.apiToken)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
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
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-full flex flex-col">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Runtime Intelligence
              </h3>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
                <FaSignOutAlt className="text-slate-700 mb-4 rotate-90" size={40} />
                <h4 className="font-medium text-slate-300 mb-2">No Active Telemetry</h4>
                <p className="text-sm text-slate-500">Run a Dasyl scaffolding command or install the Pulse Extension to see live metrics here.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Minimalistic Footer */}
      <footer className="border-t border-slate-800/60 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 Dasyl Engine. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition">Terms of Service</a>
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
