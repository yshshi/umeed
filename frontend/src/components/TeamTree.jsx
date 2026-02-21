import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

/**
 * Recursive tree node - no external library
 */
function TreeNode({ node, onSelect, depth = 0 }) {
  const hasChildren = node.children && node.children.length > 0;
  const [expanded, setExpanded] = React.useState(false);

  const handleClick = () => {
    setExpanded((e) => !e);
    onSelect?.(node);
  };

  return (
    <div className="pl-4 border-l-2 border-primary-200 ml-2">
      <button
        type="button"
        onClick={handleClick}
        className="w-full text-left mt-2 p-3 rounded-lg bg-white border border-slate-200 shadow-soft hover:border-primary-300 hover:shadow-md transition flex items-center gap-2"
      >
        {hasChildren && (
          <span className="text-slate-400">
            {expanded ? '▼' : '▶'}
          </span>
        )}
        <span className="font-medium text-primary-700">{node.memberId}</span>
        <span className="text-slate-600">{node.name}</span>
        <span className="text-xs text-slate-500">L{node.level}</span>
        <span className="text-xs text-emerald-600 ml-auto">{formatCurrency(node.walletBalance)}</span>
      </button>
      {hasChildren && expanded && (
        <div className="mt-1 space-y-0">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamTree({ tree, onSelectNode }) {
  if (!tree) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-4 p-3 rounded-lg bg-white border border-slate-200">
        <span className="font-semibold text-primary-700">{tree.memberId}</span>
        <span className="text-slate-600 ml-2">{tree.name}</span>
        <span className="text-slate-500 text-sm ml-2">Level {tree.level}</span>
        <span className="text-emerald-600 font-medium ml-auto">{formatCurrency(tree.walletBalance)}</span>
      </div>
      {tree.children && tree.children.length > 0 ? (
        tree.children.map((child) => (
          <TreeNode key={child.id} node={child} onSelect={onSelectNode} />
        ))
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500 mb-2">You have no direct team members yet.</p>
          <p className="text-sm text-slate-400 mb-4">Register new members from the Registration page to grow your team.</p>
          <Link to="/registration" className="inline-block px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">
            Register a member
          </Link>
        </div>
      )}
    </div>
  );
}
