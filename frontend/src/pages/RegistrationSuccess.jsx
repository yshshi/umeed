import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { name, memberId, password } = state;

  if (!memberId) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-400">
      <div className="w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 md:p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Congratulations!</h1>
          <p className="text-slate-600 text-lg mb-6">
            <span className="font-semibold text-primary-700">{name || 'You'}</span>, you have successfully registered with us.
          </p>
          <div className="bg-slate-50 rounded-xl p-6 space-y-4 text-left border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-500">Member ID</p>
              <p className="text-xl font-bold text-primary-700 mt-0.5 font-mono">{memberId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Password</p>
              <p className="text-lg font-mono text-slate-800 mt-0.5 break-all">{password || '—'}</p>
              <p className="text-xs text-slate-500 mt-1">Save this password; you will need it to login.</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-6">Save your Member ID and password. Use them to sign in.</p>
          <Link
            to="/login"
            className="mt-6 inline-block w-full py-3.5 px-6 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition shadow-lg shadow-primary-500/30"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
