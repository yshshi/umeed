import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TeamTree from '../components/TeamTree';
import LoadingSpinner from '../components/LoadingSpinner';
import { setChildrenAtNode, filterTreeByMemberId } from '../utils/treeHelpers';
import { formatCurrency } from '../utils/formatters';

const userId = (u) => u?._id ?? u?.id;

const SEARCH_DEBOUNCE_MS = 300;

export default function BusinessTeam() {
  const { user } = useAuth();
  const [tree, setTree] = useState(null);
  const [searchMemberId, setSearchMemberId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedNodeIds, setLoadedNodeIds] = useState(() => new Set());
  const [loadingNodeId, setLoadingNodeId] = useState(null);
  const [loadingPathForId, setLoadingPathForId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [highlightNodeId, setHighlightNodeId] = useState(null);

  const fetchRootTree = useCallback(async (uid) => {
    if (!uid) {
      setLoading(false);
      setTree(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/team/tree/${uid}`);
      setTree(data.tree);
      setLoadedNodeIds((prev) => new Set(prev).add(uid));
    } catch {
      setTree(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const uid = userId(user);
    if (uid) fetchRootTree(uid);
    else setLoading(false);
  }, [user, fetchRootTree]);

  const loadChildrenForNode = useCallback(async (nodeId) => {
    if (loadedNodeIds.has(nodeId)) return;
    setLoadingNodeId(nodeId);
    try {
      const { data } = await api.get(`/team/tree/${nodeId}`);
      const children = data.tree?.children ?? [];
      setTree((prev) => (prev ? setChildrenAtNode(prev, nodeId, children) : prev));
      setLoadedNodeIds((prev) => new Set(prev).add(nodeId));
      setExpandedIds((prev) => new Set(prev).add(nodeId));
    } catch {
      setLoadedNodeIds((prev) => new Set(prev).add(nodeId));
    } finally {
      setLoadingNodeId(null);
    }
  }, [loadedNodeIds]);

  const handleNodeClick = useCallback((node) => {
    if (!node?.id) return;
    const isExpanded = expandedIds.has(node.id);
    if (isExpanded) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(node.id);
        return next;
      });
      return;
    }
    if (loadedNodeIds.has(node.id)) {
      setExpandedIds((prev) => new Set(prev).add(node.id));
      return;
    }
    loadChildrenForNode(node.id);
  }, [expandedIds, loadedNodeIds, loadChildrenForNode]);

  const setExpanded = useCallback((nodeId, value) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (value) next.add(nodeId);
      else next.delete(nodeId);
      return next;
    });
  }, []);

  // Full-team search (includes unexpanded nodes)
  useEffect(() => {
    const q = searchMemberId.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      setSearchLoading(true);
      api
        .get('/team/search', { params: { q } })
        .then(({ data }) => setSearchResults(data.matches || []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchMemberId]);

  const loadPathToNode = useCallback(
    async (pathIds) => {
      if (!pathIds || pathIds.length <= 1) return;
      setLoadingPathForId(pathIds[pathIds.length - 1]);
      try {
        for (let i = 0; i < pathIds.length - 1; i++) {
          const nodeId = pathIds[i];
          if (loadedNodeIds.has(nodeId)) continue;
          const { data } = await api.get(`/team/tree/${nodeId}`);
          const children = data.tree?.children ?? [];
          setTree((prev) => (prev ? setChildrenAtNode(prev, nodeId, children) : prev));
          setLoadedNodeIds((prev) => new Set(prev).add(nodeId));
          setExpandedIds((prev) => new Set(prev).add(nodeId));
        }
        setHighlightNodeId(pathIds[pathIds.length - 1]);
        setTimeout(() => setHighlightNodeId(null), 2500);
      } finally {
        setLoadingPathForId(null);
      }
    },
    [loadedNodeIds]
  );

  const displayTree = useMemo(() => {
    if (!tree) return null;
    return filterTreeByMemberId(tree, searchMemberId);
  }, [tree, searchMemberId]);

  return (
    <div className="space-y-6">
      <div className="page-card p-5">
        <h1 className="text-2xl font-bold text-slate-800">Team</h1>
        <p className="text-slate-600 mt-1">Your referral tree. Click a member to expand and load their referrals (unlimited levels).</p>
      </div>

      {tree && (
        <div className="space-y-3">
          <div className="page-card p-4 flex flex-col sm:flex-row gap-2">
            <label htmlFor="team-search-member-id" className="sr-only">Search by Member ID</label>
            <input
              id="team-search-member-id"
              type="text"
              placeholder="Search by Member ID (searches full team)"
              value={searchMemberId}
              onChange={(e) => setSearchMemberId(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            />
            {searchMemberId.trim() && (
              <button
                type="button"
                onClick={() => setSearchMemberId('')}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
              >
                Clear
              </button>
            )}
          </div>
          {searchMemberId.trim() && (
            <div className="page-card p-4">
              {searchLoading ? (
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  Searching full team…
                </p>
              ) : searchResults.length > 0 ? (
                <ul className="space-y-2">
                  {searchResults.map((m) => (
                    <li key={m.id} className="flex flex-wrap items-center gap-2 justify-between py-1.5 border-b border-slate-100 last:border-0">
                      <span className="font-medium text-primary-700">{m.memberId}</span>
                      <span className="text-slate-700">{m.name}</span>
                      <span className="text-emerald-600">{formatCurrency(m.deposit)}</span>
                      <button
                        type="button"
                        onClick={() => loadPathToNode(m.pathIds)}
                        disabled={loadingPathForId === m.id}
                        className="text-sm px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60 transition"
                      >
                        {loadingPathForId === m.id ? 'Loading…' : 'Show in tree'}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm">No member found with Member ID containing &quot;{searchMemberId.trim()}&quot;.</p>
              )}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner className="h-10 w-10" />
        </div>
      ) : !tree ? (
        <div className="page-card p-8 text-center">
          <p className="text-slate-600 mb-4">Unable to load team or you are not signed in.</p>
          <Link to="/" className="text-primary-600 font-medium hover:underline">Go to Dashboard</Link>
        </div>
      ) : (
        <>
          <TeamTree
            tree={displayTree || tree}
            onNodeClick={handleNodeClick}
            expandedIds={expandedIds}
            setExpanded={setExpanded}
            loadingNodeId={loadingNodeId}
            loadedNodeIds={loadedNodeIds}
            highlightNodeId={highlightNodeId}
          />
        </>
      )}
    </div>
  );
}
