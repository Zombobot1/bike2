import './sorybook.css'
import { atom, useAtom } from 'jotai'
import { sslugify } from '../utils/sslugify'
import { capitalizeFirstLetter } from '../utils/utils'
import { ReactComponent as IDown } from './bi-caret-down-fill.svg'
import { ReactComponent as IRight } from './bi-caret-right-fill.svg'
import { FC, useEffect, useState } from 'react'
import { useRouter } from '../components/utils/hooks/use-router'
// import { sories } from './_stories'
import { useMedia } from '../components/utils/hooks/use-media'
import { SM } from '../theme'
import { ReactComponent as Burger } from './burger.svg'
import { safeSplit } from '../utils/algorithms'
import { useMount } from '../utils/hooks-utils'

export const _SORYBOOK = '/_stories'

const activeNodeIdAtom = atom('')
const activeStoryAtom = atom<{ story: FC }>({ story: () => null })

const useActiveStory = () => {
  const [activeNodeId, setActiveNodeId] = useAtom(activeNodeIdAtom)
  const [activeStory, setActiveStory] = useAtom(activeStoryAtom)
  return {
    activeNodeId,
    setActiveNodeId,
    ActiveStory: activeStory.story,
    setActiveStory: (s: FC) => setActiveStory({ story: s }),
  }
}

interface TreeP {
  id?: string
  label: string
  nodes?: TreeP[]
  nodeClassName?: string
  nodeLabelClassName?: string
  story?: FC
}
type TreePs = TreeP[]

function containsId(path: string, id?: string) {
  if (!id) return false

  const _id = id?.split('--')
  const _path = path.replace('/_stories/', '').split('--')
  let result = true
  _id.forEach((p, i) => {
    if (p !== _path[i]) result = false
  })
  return result
}

const TreeNode = ({ label, nodes, id, nodeClassName, nodeLabelClassName, story }: TreeP) => {
  const { history, location } = useRouter()

  const _isOpen = containsId(location.pathname, id)
  const [isOpen, setIsOpen] = useState(_isOpen)
  useEffect(() => {
    if (_isOpen) setIsOpen(true) // open on first render, do not close on component change
  }, [_isOpen])
  const toggleOpen = () => setIsOpen((o) => !o)

  const { activeNodeId, setActiveStory } = useActiveStory()
  useEffect(() => {
    if (activeNodeId === id && story) setActiveStory(story)
  }, [activeNodeId])

  if (!nodes) {
    return (
      <li
        className={`leaf ${activeNodeId === id ? 'leaf--active' : ''}`}
        onClick={() => history.push(_SORYBOOK + '/' + id)}
      >
        {label}
      </li>
    )
  }

  return (
    <div className={'tree-node ' + (nodeClassName ?? '')}>
      <li className={'node ' + (nodeLabelClassName ?? '')} onClick={toggleOpen}>
        {isOpen && <IDown />}
        {!isOpen && <IRight />}
        {label}
      </li>
      <ul className="collapse" style={{ display: isOpen ? 'block' : 'none' }}>
        {nodes.map((l) => (
          <TreeNode key={l.label} {...l} id={`${id}--${sslugify(l.label)}`} />
        ))}
      </ul>
    </div>
  )
}

const Tree = (tree: TreeP) => {
  return (
    <ul className="sorybook__tree">
      <h4>{tree.label}</h4>
      {tree.nodes?.map((n) => (
        <TreeNode
          key={n.label}
          {...n}
          nodeClassName="use-case"
          nodeLabelClassName="use-case__label"
          id={`${sslugify(n.label)}`}
        />
      ))}
    </ul>
  )
}

interface Sory {
  name: string
  story: FC
}
export type Sories = Sory[]

interface Component {
  name: string
  stories: Sories
}
export type ComponentWithStories = Component
type Components = Component[]

interface UseCase {
  name: string
  components: Components
}
export type UseCases = UseCase[]

function storiesToNodes(stories: Sories): TreePs {
  return stories.map((s) => ({ label: s.name, story: s.story }))
}

function componentsToNodes(components: Components): TreePs {
  return components.map((c) => ({ label: c.name, nodes: storiesToNodes(c.stories) }))
}

function useCasesToTree(rootLabel: string, useCases: UseCases): TreeP {
  return {
    label: rootLabel,
    nodes: useCases.map((uc) => ({ label: uc.name, nodes: componentsToNodes(uc.components) })),
  }
}
const offcanvasA = atom(false)

function useOffCanvas() {
  const [isOpen, setIsOpen] = useAtom(offcanvasA)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close }
}

const BreadCrumb = () => {
  const { open } = useOffCanvas()

  const { activeNodeId } = useActiveStory()
  const story = safeSplit(activeNodeId, '--').slice(-1)[0]

  return (
    <div className="sorybook__breadcrumb">
      <button className="btn shadow-none" onClick={open}>
        <Burger />
      </button>
      <h5>{story ? capitalizeFirstLetter(story) : ''}</h5>
      <div style={{ width: '45px', height: '45px' }} />
    </div>
  )
}

function NavMobile(tree: TreeP) {
  const { isOpen, close } = useOffCanvas()

  return (
    <>
      <div className="offcanvas" style={isOpen ? { width: '230px' } : { width: '0' }}>
        <div className="sorybook__nav">
          <Tree {...tree} />
        </div>
      </div>
      <div className="backdrop" style={isOpen ? { width: '100vw' } : { width: '0' }} onClick={close} />
    </>
  )
}

function Nav(tree: TreeP) {
  const isMobile = useMedia([SM], [true], false)

  if (!isMobile) {
    return (
      <div className="sorybook__nav">
        <Tree {...tree} />
      </div>
    )
  }

  return (
    <>
      <BreadCrumb />
      <NavMobile {...tree} />
    </>
  )
}

function Pane() {
  const { ActiveStory } = useActiveStory()
  return (
    <div className="sorybook__pane">
      <ActiveStory />
    </div>
  )
}
export interface SoryBook {
  sories: UseCases
}

export const SoryBook = ({ sories }: SoryBook) => {
  const { activeNodeId, setActiveNodeId } = useActiveStory()
  const { location, history } = useRouter()
  const activeId = location.pathname.replace(_SORYBOOK + '/', '')

  useEffect(() => {
    setActiveNodeId(activeId)
  }, [location])

  useEffect(() => {
    if (!activeNodeId && activeId) setActiveNodeId(activeId)
  }, [activeNodeId])

  useMount(() => {
    if (activeId !== '/_') return
    const firstStoryId = `${sslugify(sories[0].name)}--${sslugify(sories[0].components[0].name)}--${sslugify(
      sories[0].components[0].stories[0].name,
    )}`
    history.push(_SORYBOOK + '/' + firstStoryId)
  })

  return (
    <div className="sorybook">
      <Nav {...useCasesToTree('🤪 Sorybook', sories)} />
      <Pane />
    </div>
  )
}
