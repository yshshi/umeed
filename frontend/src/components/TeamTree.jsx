import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from './LoadingSpinner';

/**
 * Single node card: Member Name, Member ID, Deposit Amount. Clickable to expand/collapse.
 */
function TreeNode({
  node,
  depth,
  isLast,
  isRoot,
  expandedIds,
  loadedNodeIds,
  loadingNodeId,
  highlightNodeId,
  onNodeClick,
  setExpanded,
}) {
  const nodeId = node?.id;
  const isExpanded = expandedIds.has(nodeId);
  const isLoading = loadingNodeId === nodeId;
  const isHighlighted = highlightNodeId === nodeId;
  const hasChildren = node.children && node.children.length > 0;
  const childrenLoaded = loadedNodeIds.has(nodeId);
  const canExpand = !isRoot && (hasChildren || !childrenLoaded);

  const handleClick = () => {
    if (isRoot) return;
    if (isLoading) return;
    onNodeClick?.(node);
  };

  const deposit = node.deposit != null ? node.deposit : node.walletBalance;

  const depthIndent = !isRoot ? { marginLeft: `${(depth - 1) * 1.5}rem` } : {};

  return (
    <div className="flex flex-col" style={depthIndent}>
      <div className="flex items-stretch gap-0">
        {!isRoot && (
          <div className="flex-shrink-0 w-7 flex items-center text-slate-400 text-sm">
            {isLast ? '└' : '├'}──
          </div>
        )}
        <button
          type="button"
          onClick={handleClick}
          disabled={isRoot || isLoading}
          className={`flex-1 min-w-0 flex items-center gap-3 rounded-lg border text-left transition touch-manipulation ${
            isRoot
              ? 'bg-primary-50 border-primary-200 p-4 cursor-default'
              : 'bg-white/95 border-white/80 p-3 hover:border-primary-300 hover:shadow-md active:bg-slate-50'
          } ${isLoading ? 'opacity-70' : ''} ${isHighlighted ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
        >
          {canExpand && (
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-primary-500">
              {isLoading ? (
                <LoadingSpinner className="h-4 w-4" />
              ) : (
                <span className="text-sm">{isExpanded ? '▼' : '▶'}</span>
              )}
            </span>
          )}
          {!canExpand && !isRoot && <span className="flex-shrink-0 w-6" />}
          <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold text-primary-700 truncate">{node.memberId}</span>
            <span className="text-slate-700 truncate">{node.name}</span>
            <span className="text-emerald-600 font-medium whitespace-nowrap">{formatCurrency(deposit)}</span>
          </div>
        </button>
      </div>
      {canExpand && isExpanded && node.children && (
        <div className="mt-1 ml-4 border-l-2 border-slate-200 pl-3 space-y-1">
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={index === node.children.length - 1}
              isRoot={false}
              expandedIds={expandedIds}
              loadedNodeIds={loadedNodeIds}
              loadingNodeId={loadingNodeId}
              highlightNodeId={highlightNodeId}
              onNodeClick={onNodeClick}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      )}
      {canExpand && isExpanded && !hasChildren && childrenLoaded && (
        <div className="mt-1 ml-4 border-l-2 border-slate-200 pl-4 py-2 text-slate-500 text-sm">
          No referrals
        </div>
      )}
    </div>
  );
}

export default function TeamTree({
  tree,
  onNodeClick,
  expandedIds = new Set(),
  setExpanded,
  loadingNodeId = null,
  loadedNodeIds = new Set(),
  highlightNodeId = null,
}) {
  if (!tree) return null;

  const hasChildren = tree.children && tree.children.length > 0;
  const rootDeposit = tree.deposit != null ? tree.deposit : tree.walletBalance;

  return (
    <div className="page-card p-4 space-y-2">
      {/* Root (current user) - always visible */}
      <div className="rounded-xl border border-primary-200/80 bg-gradient-to-r from-primary-50 to-indigo-50 p-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-primary-700">{tree.memberId}</span>
        <span className="text-slate-700">{tree.name}</span>
        <span className="text-emerald-600 font-medium">{formatCurrency(rootDeposit)}</span>
        <span className="text-slate-500 text-sm">(You)</span>
      </div>
      {/* Level 1 and deeper - tree structure */}
      {hasChildren ? (
        <div className="mt-2 border-l-2 border-slate-200 pl-3 space-y-1">
          {tree.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={1}
              isLast={index === tree.children.length - 1}
              isRoot={false}
              expandedIds={expandedIds}
              loadedNodeIds={loadedNodeIds}
              loadingNodeId={loadingNodeId}
              highlightNodeId={highlightNodeId}
              onNodeClick={onNodeClick}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      ) : (
        <div className="page-card p-8 text-center mt-2">
          <p className="text-slate-500 mb-2">You have no direct referrals yet.</p>
          <p className="text-sm text-slate-400 mb-4">Register new members from the Registration page to grow your team.</p>
          <Link to="/registration" className="inline-block px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">
            Register a member
          </Link>
        </div>
      )}
    </div>
  );
}
