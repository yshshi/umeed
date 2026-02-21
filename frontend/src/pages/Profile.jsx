import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: { street: '', city: '', state: '', pincode: '', country: 'India' },
    familyDetails: { spouseName: '', children: '', dob: '' },
    bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branch: '' },
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        mobile: user.mobile || '',
        address: { street: '', city: '', state: '', pincode: '', country: 'India', ...user.address },
        familyDetails: { spouseName: '', children: '', dob: '', ...user.familyDetails },
        bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branch: '', ...user.bankDetails },
      });
    }
  }, [user]);

  const handleChange = (section, field, value) => {
    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', {
        name: form.name,
        mobile: form.mobile,
        address: form.address,
        familyDetails: form.familyDetails,
        bankDetails: form.bankDetails,
      });
      await refreshUser();
      addToast('Profile updated successfully');
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange(null, 'name', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="text" value={user.email} readOnly className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile</label>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => handleChange(null, 'mobile', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['street', 'city', 'state', 'pincode', 'country'].map((f) => (
              <div key={f}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input
                  type="text"
                  value={form.address[f] || ''}
                  onChange={(e) => handleChange('address', f, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Family Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Spouse Name</label>
              <input
                type="text"
                value={form.familyDetails.spouseName || ''}
                onChange={(e) => handleChange('familyDetails', 'spouseName', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Children</label>
              <input
                type="text"
                value={form.familyDetails.children || ''}
                onChange={(e) => handleChange('familyDetails', 'children', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DOB</label>
              <input
                type="date"
                value={form.familyDetails.dob ? form.familyDetails.dob.slice(0, 10) : ''}
                onChange={(e) => handleChange('familyDetails', 'dob', e.target.value || null)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-slate-200/80 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['accountHolderName', 'bankName', 'accountNumber', 'ifscCode', 'branch'].map((f) => (
              <div key={f}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {f.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                </label>
                <input
                  type="text"
                  value={form.bankDetails[f] || ''}
                  onChange={(e) => handleChange('bankDetails', f, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 transition"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
