import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatDate, formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositUserId, setDepositUserId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [totalAmountUserId, setTotalAmountUserId] = useState(null);
  const [totalAmountVal, setTotalAmountVal] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [u, s] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
      ]);
      setUsers(u.data.users || []);
      setStats(s.data.stats || {});
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleActive = async (id, current) => {
    try {
      await api.put(`/admin/users/${id}/active`, { isActive: !current });
      addToast('User updated');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const submitDeposit = async (userId) => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      addToast('Enter a valid amount', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/admin/users/${userId}/deposit`, { amount: amt });
      addToast('Deposit added and commission processed');
      setDepositUserId(null);
      setDepositAmount('');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const submitTotalAmount = async (userId) => {
    const amt = parseFloat(totalAmountVal);
    if (amt < 0) {
      addToast('Enter a valid amount', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${userId}/total-amount`, { totalAmount: amt });
      addToast('Total amount updated');
      setTotalAmountUserId(null);
      setTotalAmountVal('');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed', 'error');
    } finally {
      setSubmitting(false);
    }
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
      <div className="page-card p-5">
        <h1 className="text-2xl font-bold text-slate-800">Admin</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="page-card-hover p-5">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-2xl font-bold text-primary-600">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="page-card-hover p-5">
          <p className="text-sm text-slate-500">Active Users</p>
          <p className="text-2xl font-bold text-emerald-600">{stats?.activeUsers ?? 0}</p>
        </div>
        <div className="page-card-hover p-5">
          <p className="text-sm text-slate-500">Total Commission (Platform)</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats?.totalCommission)}</p>
        </div>
      </div>

      <div className="page-card overflow-hidden">
        <h2 className="px-4 py-3 text-lg font-semibold text-slate-800 border-b border-slate-200">All Users</h2>
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-50 to-indigo-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Member ID</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Email</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Level</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Total Deposit</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Total Amount</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Registered</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-sm font-medium">{u.memberId}</td>
                  <td className="px-4 py-3 text-sm">{u.name}</td>
                  <td className="px-4 py-3 text-sm">{u.email}</td>
                  <td className="px-4 py-3 text-sm">{u.level}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(u.totalDeposit)}
                    {depositUserId === u._id ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-24 px-2 py-1 border rounded text-sm"
                          placeholder="Amount"
                        />
                        <button type="button" onClick={() => submitDeposit(u._id)} disabled={submitting} className="text-xs px-2 py-1 bg-primary-600 text-white rounded">Add</button>
                        <button type="button" onClick={() => { setDepositUserId(null); setDepositAmount(''); }} className="text-xs text-slate-500">Cancel</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setDepositUserId(u._id)} className="text-xs text-primary-600 hover:underline ml-1">Add deposit</button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(u.totalAmount)}
                    {totalAmountUserId === u._id ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={totalAmountVal}
                          onChange={(e) => setTotalAmountVal(e.target.value)}
                          className="w-24 px-2 py-1 border rounded text-sm"
                          placeholder="Amount"
                        />
                        <button type="button" onClick={() => submitTotalAmount(u._id)} disabled={submitting} className="text-xs px-2 py-1 bg-primary-600 text-white rounded">Set</button>
                        <button type="button" onClick={() => { setTotalAmountUserId(null); setTotalAmountVal(''); }} className="text-xs text-slate-500">Cancel</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => { setTotalAmountUserId(u._id); setTotalAmountVal(String(u.totalAmount || '')); }} className="text-xs text-primary-600 hover:underline ml-1">Set</button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDate(u.registrationDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(u._id, u.isActive)}
                      className={`text-sm font-medium ${u.isActive ? 'text-red-600 hover:underline' : 'text-emerald-600 hover:underline'}`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
