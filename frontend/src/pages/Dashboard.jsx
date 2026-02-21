import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState({ directMembers: 0, totalMembers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [r] = await Promise.all([api.get('/team/stats'), refreshUser()]);
        setStats({ directMembers: r.data.directMembers ?? 0, totalMembers: r.data.totalMembers ?? 0 });
      } catch {
        setStats({ directMembers: 0, totalMembers: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshUser]);

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode || ''}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    addToast('Referral link copied!');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5 hover:shadow-md transition">
          <p className="text-sm text-slate-500">Member ID</p>
          <p className="text-lg font-semibold text-primary-700 mt-1">{user?.memberId}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5 hover:shadow-md transition">
          <p className="text-sm text-slate-500">Level</p>
          <p className="text-lg font-semibold text-slate-800 mt-1">{user?.level}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5 hover:shadow-md transition">
          <p className="text-sm text-slate-500">Registration Date</p>
          <p className="text-lg font-semibold text-slate-800 mt-1">{formatDate(user?.registrationDate)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5 hover:shadow-md transition">
          <p className="text-sm text-slate-500">Business</p>
          <p className="text-lg font-semibold text-slate-800 mt-1">{user?.businessType}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Total Members</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">{stats.totalMembers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Direct Members</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">{stats.directMembers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(user?.totalIncome)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Wallet Balance</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(user?.walletBalance)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Your Referral Link</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 text-sm"
          />
          <button
            type="button"
            onClick={copyLink}
            className="px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition whitespace-nowrap"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
