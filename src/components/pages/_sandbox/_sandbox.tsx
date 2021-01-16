import './_sandbox.scss';
import React, { ChangeEvent, useEffect, useState } from 'react';
import TrainingCardsInfo, { TrainingCardsInfoP } from '../../cards/training-cards-info';
import { Overdue } from '../../icons/icons';
import { OverdueType } from '../../cards/notification/notification';
import { SmallDeckCard } from '../../cards/types';
import { cn, pcn } from '../../../utils/utils';
import { ReactComponent as CollapseI } from './chevron-up-icon.svg';
import { useToggle } from '../../utils/hooks/use-toggle';
import { range, curry, keys } from 'lodash';

import NavBar from '../../navigation/navbar';
import Breadcrumb from '../../navigation/breadcrumb';
import { Switch } from 'react-router-dom';
import { buildRoutes } from '../../utils/routing';
import Footer from '../../footer';
import { COLORS } from '../../../config';
import { HeadlessModal, Modal } from '../../utils/footless-modal';
import { ModalTrigger } from '../../utils/modal-trigger';
import { ValueUpdate } from '../../../utils/types';
import { BoolStateT, StrStateT } from '../../forms/hoc/with-validation';
import { ReactComponent as Left } from '../../icons/chevron-left.svg';
import { useEventListener, useGlobalEventListener } from '../../utils/hooks/use-event-listener';

const eachNth = <T,>(arr: T[], n: number, from: number): T[] => arr.slice(from).filter((e, i) => i % n === 0);

export interface DeckCard extends SmallDeckCard {
  deckPath: string;
}

export interface TrainingCardInfo {
  overdue: OverdueType;
  trainingCardsInfo: TrainingCardsInfoP;
}

export interface TrainingCardP extends DeckCard, TrainingCardInfo {}

const TrainingCard = ({ overdue, deckColor, deckName, deckPath, trainingCardsInfo }: TrainingCardP) => {
  return (
    <div className="training-card">
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <Overdue type={overdue} />
      <span className="deck-path">{deckPath}</span>
      <strong className="deck-name">{deckName}</strong>
      <TrainingCardsInfo {...trainingCardsInfo} />
    </div>
  );
};

export interface NamedDeck {
  deckName: string;
}

export interface TrainingCardsP extends NamedDeck {
  deckName: string;
  trainings: TrainingCardP[];
}

enum DisplayedTrainingType {
  All,
  Warning,
  Danger,
}

export interface TrainingsFilterBtnP {
  currentOption: DisplayedTrainingType;
  setCurrentOption: (option: DisplayedTrainingType) => void;
}

const TrainingsFilterBtn = ({ currentOption, setCurrentOption }: TrainingsFilterBtnP) => {
  return (
    <>
      <button className="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown">
        {DisplayedTrainingType[currentOption]}
      </button>
      <ul className="dropdown-menu">
        <li>
          <div className="dropdown-item" onClick={() => setCurrentOption(DisplayedTrainingType.All)}>
            All
          </div>
        </li>
        <li>
          <div className="dropdown-item" onClick={() => setCurrentOption(DisplayedTrainingType.Warning)}>
            Warning
          </div>
        </li>
        <li>
          <div className="dropdown-item" onClick={() => setCurrentOption(DisplayedTrainingType.Danger)}>
            Danger
          </div>
        </li>
      </ul>
    </>
  );
};

const rnd = (max: number) => Math.floor(Math.random() * max);
const totalToRepeatAndToLearn = (trainings: TrainingCardP[]): TrainingCardsInfoP => {
  const toLearn = trainings.reduce((p, e) => p + e.trainingCardsInfo.toLearn, 0);
  const toRepeat = trainings.reduce((p, e) => p + e.trainingCardsInfo.toRepeat, 0);
  return { toLearn, toRepeat };
};
const chop = (str: string, size: number): string => {
  if (str.length < size) return str;
  return str.slice(0, size) + '...';
};

const TrainingDeck = ({ deckName, trainings }: TrainingCardsP) => {
  const hasDanger = trainings.find((e) => e.overdue === OverdueType.Danger);
  const hasWarning = !hasDanger && trainings.find((e) => e.overdue === OverdueType.Warning);
  const subheaderNames = cn('subheader', pcn('overdue-indicator', { '--warning': hasWarning, '--danger': hasDanger }));
  const [option, setOption] = useState(DisplayedTrainingType.All);
  const [displayedTrainings, setDisplayedTrainings] = useState(trainings);
  const filter = (option: DisplayedTrainingType) => {
    if (option === DisplayedTrainingType.All) setDisplayedTrainings(trainings);
    else if (option === DisplayedTrainingType.Danger)
      setDisplayedTrainings(trainings.filter((e) => e.overdue === OverdueType.Danger));
    else setDisplayedTrainings(trainings.filter((e) => e.overdue === OverdueType.Warning));
    setOption(option);
  };
  const [isCollapsed, setIsCollapsed] = useToggle(false);
  const totalRepeatAndLearn = totalToRepeatAndToLearn(trainings);
  const collapseId = rnd(1e3);
  return (
    <div className="training-cards mb-3">
      <div className="heading d-flex justify-content-between">
        <button
          className="transparent-button collapse-btn"
          data-bs-toggle="collapse"
          data-bs-target={'#c' + collapseId}
          onClick={setIsCollapsed}
        >
          <CollapseI className={cn('chevron-up-icon', { collapsed: isCollapsed })} />
        </button>
        <h3 className={'me-auto ' + subheaderNames}>{chop(deckName, 10)}</h3>
        {!isCollapsed && <TrainingsFilterBtn currentOption={option} setCurrentOption={filter} />}
        {isCollapsed && <TrainingCardsInfo {...totalRepeatAndLearn} />}
      </div>
      <div className="collapse show" id={'c' + collapseId}>
        <div>
          <div className="d-flex flex-column cards">
            {displayedTrainings.map((e, i) => (
              <TrainingCard {...e} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mathTrainings = [
  {
    overdue: OverdueType.None,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const jsTrainings = [
  {
    overdue: OverdueType.Danger,
    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FCA95C',
    deckName: 'Workers',
    deckPath: 'Browsers',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#eced2b',
    deckName: 'Async & Await',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const englishTrainings = [
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const cppTrainings = [
  {
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const pythonTrainings = [
  {
    overdue: OverdueType.None,
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const cookingTrainings = [
  {
    overdue: OverdueType.Danger,
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];

const decks = [
  { deckName: 'Math', trainings: mathTrainings },
  { deckName: 'Js', trainings: jsTrainings },
  { deckName: 'English', trainings: englishTrainings },
  { deckName: 'C++', trainings: cppTrainings },
  { deckName: 'Python', trainings: pythonTrainings },
  { deckName: 'Cooking', trainings: cookingTrainings },
];

const useCurrentWidth = (widths: number[]) => {
  const selectClosestWidth = () => {
    const min = Math.min(...widths);
    return widths.find((e) => e <= window.innerWidth) || min;
  };
  const [cw, scw] = useState<number>(selectClosestWidth());
  useGlobalEventListener('resize', () => scw(selectClosestWidth()));
  return cw;
};

const Trainings = () => {
  const widthAndColumnNumbers = new Map<number, number>([
    [1200, 3],
    [850, 2],
    [500, 1],
  ]);
  const currentWidth = useCurrentWidth(Array.from(widthAndColumnNumbers.keys()));
  const selectColumnNumber = () => widthAndColumnNumbers.get(currentWidth) || 0;
  const [columnNumber, setColumnNumber] = useState(selectColumnNumber());
  useEffect(() => setColumnNumber(selectColumnNumber()), [currentWidth]);
  return (
    <div className="d-flex decks-to-train">
      {range(columnNumber).map((i) => (
        <div className={cn({ 'me-3': i !== columnNumber - 1 })} key={i}>
          {eachNth(decks, columnNumber, i).map((e, j) => (
            <TrainingDeck {...e} key={j} />
          ))}
        </div>
      ))}
      <div className="w-100 trainings-footer" />
    </div>
  );
};

const Study = () => {
  return (
    <div className="study">
      <div className="regular-trainings">
        <div className="d-flex justify-content-between heading">
          <h2 className="page-header">Regular trainings</h2>
          <DeckSettingsModalTrigger />
          <DeckSettingsModal />
        </div>
        <Trainings />
      </div>
    </div>
  );
};

export interface TrainingDeckSettingsHeaderP {
  deckName: string;
  splittingActive: BoolStateT;
  back: () => void;
}

const TrainingDeckSettingsHeader = ({ deckName, splittingActive, back }: TrainingDeckSettingsHeaderP) => {
  const [isSplittingActive, setIsSplittingActive] = splittingActive;
  return (
    <>
      <div className="d-flex justify-content-start">
        <Left className="transparent-button align-self-center me-3" onClick={back} />
        <div className="d-flex flex-column">
          <span className="settings__deck-label-container">
            <span className="settings__deck-label">Deck</span>
          </span>
          <span className="settings__deck-name">{deckName}</span>
        </div>
      </div>
      <ul className="nav nav-tabs mb-3 mt-3">
        <li className="nav-item">
          <a
            className={cn('nav-link', { active: isSplittingActive })}
            onClick={() => {
              console.log('aaa');
              setIsSplittingActive(true);
            }}
            aria-current="page"
            href="#"
          >
            Split
          </a>
        </li>
        <li className="nav-item">
          <a
            className={cn('nav-link', { active: !isSplittingActive })}
            onClick={() => setIsSplittingActive(false)}
            href="#"
          >
            Merge
          </a>
        </li>
      </ul>
    </>
  );
};

export interface SubdeckP {
  name: string;
  split: (v: string) => void;
  merge: (v: string) => void;
}

const Subdeck = ({ name, split, merge }: SubdeckP) => {
  const [value, toggle] = useToggle(true);
  const onClick = () => {
    if (value) merge(name);
    else split(name);
    toggle();
  };
  return (
    <li
      className={cn('list-group-item d-flex justify-content-between included-subdeck', { excluded: !value })}
      onClick={onClick}
    >
      <span className="deck-name">{name}</span>
      <input className="form-check-input" type="checkbox" checked={value} readOnly />
    </li>
  );
};

export interface SplittableHierarchy {
  split: (root: string, subdeck: string) => void;
  merge: (root: string, subdeck: string) => void;
}

export interface SubdecksBaseP extends SplittableHierarchy {
  subdeckNames: string[];
}

export interface SubdecksP extends SubdecksBaseP, NamedDeck {}

const Subdecks = ({ deckName, subdeckNames, split, merge }: SubdecksP) => {
  const splitMe = curry(split)(deckName);
  const mergeWithMe = curry(merge)(deckName);
  return (
    <>
      {!subdeckNames.length && <div className="no-content">There is no subdecks to split.</div>}
      <ul className="list-group mb-3">
        {subdeckNames.map((e, i) => (
          <Subdeck name={e} split={splitMe} merge={mergeWithMe} key={i} />
        ))}
      </ul>
    </>
  );
};

export interface RadioButtonP {
  id: string;
  name: string;
  label: string;
  activeValue: StrStateT;
}

const RadioButton = ({ id, label, name, activeValue }: RadioButtonP) => {
  const [active, setActive] = activeValue;

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        id={id}
        checked={id === active}
        onChange={() => setActive(id)}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export interface RadioOption {
  id: string;
  label: string;
}

export interface RadioInputP {
  name: string;
  options: RadioOption[];
  onChange: (current: string, prev: string) => void;
}

const useSateWithOnChange = (onChange: (current: string, prev: string) => void): StrStateT => {
  const [value, setValue] = useState('');
  const [prev, setPrev] = useState('');
  if (value !== prev) {
    onChange(value, prev);
    setPrev(value);
  }
  return [value, setValue];
};

const RadioInput = ({ name, options, onChange }: RadioInputP) => {
  const activeValue = useSateWithOnChange(onChange);
  return (
    <>
      {options.map((e, i) => (
        <RadioButton id={e.id} name={name} label={e.label} activeValue={activeValue} key={i} />
      ))}
    </>
  );
};

export interface ParentDecksP extends NamedDeck, SplittableHierarchy {
  parentNames: string[];
}

const ParentDecks = ({ deckName, parentNames, split, merge }: ParentDecksP) => {
  const options = parentNames.map((e) => ({ id: e, label: e }));
  const onChange = (curr: string, prev: string) => {
    if (prev) split(prev, deckName);
    merge(curr, deckName);
  };
  return (
    <div className="parent-decks mb-3">
      {!parentNames.length && <div className="no-content">This is a root deck. It cannot be merged.</div>}
      <RadioInput name="parents" options={options} onChange={onChange} />
    </div>
  );
};

export interface DeckSettingsP extends NamedDeck, SplittableHierarchy {
  subdecksNames: string[];
  parentsNames: string[];
  back: () => void;
}

const DeckSettings = ({ deckName, merge, split, parentsNames, subdecksNames, back }: DeckSettingsP) => {
  const isSplittingActive = useState(true);
  const decks = { deckName: deckName, merge, split };
  const subdecks = { ...decks, subdeckNames: subdecksNames };
  const parents = { ...decks, parentNames: parentsNames };
  const splitInfo = 'Tap on a deck to show it separately on the screen';
  const mergeInfo = 'Select a deck to include this one inside';
  return (
    <>
      <TrainingDeckSettingsHeader splittingActive={isSplittingActive} deckName={deckName} back={back} />
      <p className="settings-info mb-4">{isSplittingActive ? splitInfo : mergeInfo}</p>
      {isSplittingActive[0] && <Subdecks {...subdecks} deckName={deckName} />}
      {!isSplittingActive[0] && <ParentDecks {...parents} deckName={deckName} />}
    </>
  );
};

export interface DeckSelectionP {
  decks: string[];
  select: (v: string) => void;
}

const DeckSelection = ({ decks, select }: DeckSelectionP) => {
  return (
    <>
      <h3 className="selection-info">Select a deck to split or merge</h3>
      <ul className="list-group mb-3 mt-4">
        {decks.map((e, i) => (
          <li className="list-group-item deck-to-tune" onClick={() => select(e)} key={i}>
            {e}
          </li>
        ))}
      </ul>
    </>
  );
};

export interface TrainingDecksSettingsP extends SplittableHierarchy {
  trainingDecks: {
    [p: string]: { subdecksNames: string[]; parentsNames: string[] };
  };
}

const TrainingDecksSettings = ({ trainingDecks, merge, split }: TrainingDecksSettingsP) => {
  const [selectedDeck, setSelectedDeck] = useState('');
  const { subdecksNames, parentsNames } = trainingDecks[selectedDeck] || {};
  const decks = keys(trainingDecks);
  return (
    <div>
      {!selectedDeck && <DeckSelection decks={decks} select={setSelectedDeck} />}
      {selectedDeck && (
        <DeckSettings
          subdecksNames={subdecksNames}
          parentsNames={parentsNames}
          deckName={selectedDeck}
          split={split}
          merge={merge}
          back={() => setSelectedDeck('')}
        />
      )}
    </div>
  );
};

const trainingDecksSettings = {
  trainingDecks: {
    Js: {
      subdecksNames: ['Basics', 'Advanced'],
      parentsNames: ['IT'],
    },
    Python: {
      subdecksNames: ['Libraries', 'Advanced'],
      parentsNames: ['IT'],
    },
  },
  split: (root: string, subdeck: string) => {
    console.info('split', root, subdeck);
  },
  merge: (root: string, subdeck: string) => {
    console.info('merge', root, subdeck);
  },
};

const deckSettingsModalId = 'split-merge-decks';

const DeckSettingsModal = HeadlessModal(deckSettingsModalId, () => (
  <TrainingDecksSettings {...trainingDecksSettings} />
));

const DeckSettingsModalTrigger = () => (
  <ModalTrigger className="btn btn-sm btn-outline-primary settings-trigger" text="Tune" modalId={deckSettingsModalId} />
);

const Sandbox = () => {
  return (
    // <div style={{ width: '100vw', height: '100vh', padding: '100px 100px', backgroundColor: COLORS.bg }}>
    //   <TrainingDeck {...decks[0]} />
    // </div>
    <>
      <NavBar />
      <main className="content-area">
        <Breadcrumb />
        <Study />
        <Footer className="footer" />
      </main>
    </>
  );
};

export { Sandbox };
