import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function BusinessSelf() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Business - Self</h1>
      <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Selected Business</p>
            <p className="text-lg font-semibold text-slate-800">{user?.businessType}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Joining Date</p>
            <p className="text-lg font-semibold text-slate-800">{formatDate(user?.registrationDate)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Income Generated</p>
            <p className="text-lg font-semibold text-emerald-600">{formatCurrency(user?.totalIncome)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
