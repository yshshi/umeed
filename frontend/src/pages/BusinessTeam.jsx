import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TeamTree from '../components/TeamTree';
import LoadingSpinner from '../components/LoadingSpinner';

// Use _id from API response (MongoDB); user.id may be undefined
const userId = (u) => u?._id ?? u?.id;

export default function BusinessTeam() {
  const { user } = useAuth();
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(() => userId(user));

  const fetchTree = async (uid) => {
    if (!uid) {
      setLoading(false);
      setTree(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/team/tree/${uid}`);
      setTree(data.tree);
    } catch {
      setTree(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const uid = userId(user);
    if (uid) setSelectedUserId(uid);
  }, [user]);

  useEffect(() => {
    if (selectedUserId) fetchTree(selectedUserId);
    else setLoading(false);
  }, [selectedUserId]);

  const handleSelectNode = (node) => {
    if (node?.id) setSelectedUserId(node.id);
  };

  const currentUserId = userId(user);
  const showBack = selectedUserId && selectedUserId !== currentUserId;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Business - Team</h1>
      <p className="text-slate-600">Click a member to load their subtree (level 1).</p>
      {showBack && (
        <button
          type="button"
          onClick={() => setSelectedUserId(currentUserId)}
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition text-sm font-medium"
        >
          ← Back to my team
        </button>
      )}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner className="h-10 w-10" />
        </div>
      ) : !tree ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600 mb-4">Unable to load team or you are not signed in.</p>
          <Link to="/" className="text-primary-600 font-medium hover:underline">Go to Dashboard</Link>
        </div>
      ) : (
        <TeamTree tree={tree} onSelectNode={handleSelectNode} />
      )}
    </div>
  );
}
