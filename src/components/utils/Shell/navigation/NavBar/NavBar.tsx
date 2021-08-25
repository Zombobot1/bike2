import { Box } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import { str, strs, bool } from '../../../../../utils/types'
import { useState } from 'react'

type E = React.SyntheticEvent<Element, Event>

export interface NavTree {
  id: str
  name: str
  isOpen: bool
  children?: NavTree[]
}

export type NavTrees = NavTree[]

export interface WS {
  personal: NavTrees
}

export function NavTree({ id, name, children }: NavTree) {
  if (!children) return <TreeItem nodeId={id} label={name} />
  return (
    <TreeItem nodeId={id} label={name}>
      {children.map((c) => (
        <NavTree key={c.id} {...c} />
      ))}
    </TreeItem>
  )
}

function openedIds(tree: NavTree): strs {
  if (!tree.children) return tree.isOpen ? [tree.id] : []
  let r: strs = tree.isOpen ? [tree.id] : []
  tree.children.forEach((c) => (r = [...r, ...openedIds(c)]))
  return r
}

export interface NavBar {
  trees: NavTrees
}

export function NavBar({ trees }: NavBar) {
  const [expanded, setExpanded] = useState<strs>(trees.map((t) => openedIds(t)).flat())
  const [selected, setSelected] = useState<strs>([])

  const handleToggle = (_path: E, nodeIds: strs) => setExpanded(nodeIds)
  const handleSelect = (_: E, nodeIds: strs) => setSelected(nodeIds)

  return (
    <Box sx={{ height: 270, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {trees.map((t) => (
          <NavTree key={t.id} {...t} />
        ))}
      </TreeView>
    </Box>
  )
}
