import './sorybook.scss';
import { atom, useAtom } from 'jotai';
import { useToggle } from '../components/utils/hooks/use-toggle';
import { sslugify } from '../utils/sslugify';
import { capitalizeFirstLetter, cn } from '../utils/utils';
import { ReactComponent as IDown } from '../components/icons/bi-caret-down-fill.svg';
import { ReactComponent as IRight } from '../components/icons/bi-caret-right-fill.svg';
import React, { FC, useEffect } from 'react';
import { useRouter } from '../components/utils/hooks/use-router';
import { sories } from './_stories';
import { useMedia } from '../components/utils/hooks/use-media';
import { SM } from '../config';
import { ReactComponent as Burger } from '../components/navigation/breadcrumb/burger.svg';
import { safeSplit } from '../utils/algorithms';

export const _SORYBOOK = '/_stories';

const activeNodeIdAtom = atom('');
const activeStoryAtom = atom<{ story: FC }>({ story: () => null });

const useActiveStory = () => {
  const [activeNodeId, setActiveNodeId] = useAtom(activeNodeIdAtom);
  const [activeStory, setActiveStory] = useAtom(activeStoryAtom);
  return {
    activeNodeId,
    setActiveNodeId,
    ActiveStory: activeStory.story,
    setActiveStory: (s: FC) => setActiveStory({ story: s }),
  };
};

interface TreeP {
  id?: string;
  label: string;
  nodes?: TreeP[];
  nodeClassName?: string;
  nodeLabelClassName?: string;
  story?: FC;
}
type TreePs = TreeP[];

const TreeNode = ({ label, nodes, id, nodeClassName, nodeLabelClassName, story }: TreeP) => {
  const { history, location } = useRouter();
  const [isOpen, toggleOpen] = useToggle(id ? location.pathname.includes(id) : false);

  const { activeNodeId, setActiveStory } = useActiveStory();
  useEffect(() => {
    if (activeNodeId === id && story) setActiveStory(story);
  }, [activeNodeId]);

  const collapseId = sslugify(`${label}-${id}`);

  if (!nodes) {
    const cns = cn('leaf', { 'leaf--active': activeNodeId === id });
    return (
      <li className={cns} onClick={() => history.push(_SORYBOOK + '/' + id)}>
        {label}
      </li>
    );
  }
  const cns = cn('collapse', { show: isOpen });
  return (
    <div className={'tree-node ' + (nodeClassName ?? '')}>
      <li
        className={'node ' + (nodeLabelClassName ?? '')}
        data-bs-toggle="collapse"
        data-bs-target={`#${collapseId}`}
        aria-expanded="false"
        aria-controls="collapseExample"
        onClick={toggleOpen}
      >
        {isOpen && <IDown />}
        {!isOpen && <IRight />}
        {label}
      </li>
      <ul className={cns} id={collapseId}>
        {nodes.map((l) => (
          <TreeNode key={l.label} {...l} id={`${id}--${sslugify(l.label)}`} />
        ))}
      </ul>
    </div>
  );
};

const Tree = (tree: TreeP) => {
  return (
    <ul className="tree">
      <h5>{tree.label}</h5>
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
  );
};

interface Sory {
  name: string;
  story: FC;
}
type Stories = Sory[];

interface Component {
  name: string;
  stories: Stories;
}
export type ComponentWithStories = Component;
type Components = Component[];

interface UseCase {
  name: string;
  components: Components;
}
type UseCases = UseCase[];

function storiesToNodes(stories: Stories): TreePs {
  return stories.map((s) => ({ label: s.name, story: s.story }));
}

function componentsToNodes(components: Components): TreePs {
  return components.map((c) => ({ label: c.name, nodes: storiesToNodes(c.stories) }));
}

function useCasesToTree(rootLabel: string, useCases: UseCases): TreeP {
  return {
    label: rootLabel,
    nodes: useCases.map((uc) => ({ label: uc.name, nodes: componentsToNodes(uc.components) })),
  };
}

const BreadCrumb = () => {
  const { activeNodeId } = useActiveStory();
  const story = safeSplit(activeNodeId, '--').slice(-1)[0];

  return (
    <div className="d-flex justify-content-between align-items-center sorybook__breadcrumb">
      <button className="btn shadow-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">
        <Burger />
      </button>
      <h5 className="mb-0">{story ? capitalizeFirstLetter(story) : ''}</h5>
      <div style={{ width: '45px', height: '45px' }} />
    </div>
  );
};

function NavMobile(tree: TreeP) {
  return (
    <div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample">
      <div className="offcanvas-body">
        <div className="sorybook__nav">
          <Tree {...tree} />
        </div>
      </div>
    </div>
  );
}

function Nav(tree: TreeP) {
  const isMobile = useMedia([SM], [true], false);

  if (!isMobile) {
    return (
      <div className="sorybook__nav">
        <Tree {...tree} />
      </div>
    );
  }

  return (
    <>
      <BreadCrumb />
      <NavMobile {...tree} />
    </>
  );
}

function Pane() {
  const { ActiveStory } = useActiveStory();
  return (
    <div className="w-100 h-100 pane">
      <ActiveStory />
    </div>
  );
}

export const SoryBook = () => {
  const { activeNodeId, setActiveNodeId } = useActiveStory();
  const { location } = useRouter();
  const activeId = location.pathname.replace(_SORYBOOK + '/', '');

  useEffect(() => {
    setActiveNodeId(activeId);
  }, [location]);

  useEffect(() => {
    if (!activeNodeId && activeId) setActiveNodeId(activeId);
  }, [activeNodeId]);

  return (
    <div className="sorybook">
      <Nav {...useCasesToTree('🤪 Sorybook', sories)} />
      <Pane />
    </div>
  );
};
