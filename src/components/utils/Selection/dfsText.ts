export function dfsText(node: ChildNode) {
  function dfs(node: ChildNode) {
    const r = [node]
    for (const child of node.childNodes) {
      if (child.nodeName !== 'CODE') r.push(...dfs(child))
    }
    return r
  }

  return dfs(node).filter((n) => n.nodeType === 3)
}
