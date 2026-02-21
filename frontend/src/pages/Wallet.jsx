import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Wallet() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshUser();
        const { data } = await api.get('/wallet/transactions');
        setTransactions(data.transactions || []);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshUser]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Wallet</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Wallet Balance</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(user?.walletBalance)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(user?.totalIncome)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Total Bonus</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(user?.totalBonus)}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 overflow-hidden">
        <h2 className="px-4 py-3 text-lg font-semibold text-slate-800 border-b border-slate-200">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Type</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No transactions yet.</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-sm">{formatDate(t.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(t.amount)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
