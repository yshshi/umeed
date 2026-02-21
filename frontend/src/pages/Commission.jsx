import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDate, formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Commission() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/commissions');
        setCommissions(data.commissions || []);
      } catch {
        setCommissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Commission History</h1>
      <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">From User</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Level</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No commission history yet.
                  </td>
                </tr>
              ) : (
                commissions.map((c) => (
                  <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-sm text-slate-700">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-sm">{c.fromName} ({c.fromMemberId})</td>
                    <td className="px-4 py-3 text-sm">{c.level}</td>
                    <td className="px-4 py-3 text-sm font-medium text-emerald-600">{formatCurrency(c.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        c.status === 'credited' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
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
