/**
 * Set children for a node by id in an immutable way.
 * Returns a new tree (shallow copy on the path to the node).
 */
export function setChildrenAtNode(node, nodeId, newChildren) {
  if (node.id === nodeId) {
    return { ...node, children: newChildren };
  }
  if (!node.children || node.children.length === 0) return node;
  return {
    ...node,
    children: node.children.map((child) => setChildrenAtNode(child, nodeId, newChildren)),
  };
}

/**
 * Filter tree by Member ID search (case-insensitive contains).
 * Keeps root always; for other nodes keeps only if node matches or has a matching descendant.
 */
export function filterTreeByMemberId(node, search, isRoot = true) {
  const q = (search || '').trim().toUpperCase();
  if (!q) return node;

  if (isRoot) {
    const filteredChildren = (node.children || [])
      .map((child) => filterTreeByMemberId(child, search, false))
      .filter(Boolean);
    return { ...node, children: filteredChildren };
  }

  const nodeMatches = (node.memberId || '').toUpperCase().includes(q);
  const filteredChildren = (node.children || [])
    .map((child) => filterTreeByMemberId(child, search, false))
    .filter(Boolean);
  const hasMatchingDescendant = filteredChildren.length > 0;

  if (nodeMatches || hasMatchingDescendant) {
    return { ...node, children: filteredChildren };
  }
  return null;
}
