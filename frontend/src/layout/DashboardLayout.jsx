import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
  {
    label: 'Business',
    children: [
      { to: '/business/self', label: 'Self' },
      { to: '/business/team', label: 'Team' },
    ],
  },
  { to: '/registration', label: 'Registration' },
  { to: '/commission', label: 'Commission' },
  { to: '/wallet', label: 'Wallet' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 max-w-[85vw] bg-white/95 backdrop-blur-md border-r border-slate-200 shadow-soft transform transition-transform duration-200 ease-out overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-start gap-3">

              {/* Logo */}
              <img
                 src="../../images/logo.jpeg"
                alt="Umeed Logo"
                className="w-10 h-10 object-contain"
              />

              {/* Text Section */}
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary-700 leading-none">
                  Ummed
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {user?.memberId}
                </p>
              </div>

            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setBusinessOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-3 py-3 min-h-[44px] rounded-lg text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition touch-manipulation"
                    aria-expanded={businessOpen}
                    aria-haspopup="true"
                  >
                    <span className="text-base font-medium truncate">{item.label}</span>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ml-2 transition ${businessOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {businessOpen && (
                    <div className="pl-3 mt-1 space-y-1 overflow-visible">
                      {item.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-3 min-h-[44px] rounded-lg text-base transition touch-manipulation ${
                              isActive ? 'bg-primary-100 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                            }`
                          }
                          onClick={() => setSidebarOpen(false)}
                        >
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg transition ${
                      isActive ? 'bg-primary-100 text-primary-700 font-medium' : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              )
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition mt-2 border-t border-slate-200 pt-2 ${
                    isActive ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-amber-50'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                Admin
              </NavLink>
            )}
          </nav>
          <div className="p-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 lg:px-6">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <Link to="/">
            <span className="text-sm text-slate-600 hover:text-primary-600 cursor-pointer transition">
              {user?.name}
            </span>
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay when sidebar open on mobile */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}
    </div>
  );
}
