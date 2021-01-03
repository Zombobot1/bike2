import './_sandbox.scss';
import React, { useState } from 'react';
import TrainingCardsInfo, { TrainingCardsInfoP } from '../../cards/training-cards-info';
import { Overdue } from '../../icons/icons';
import { OverdueType } from '../../cards/notification/notification';
import { SmallDeckCard } from '../../cards/types';
import { cn, pcn } from '../../../utils/utils';
import { ReactComponent as CollapseI } from './chevron-up-icon.svg';
// import NavBar from '../../navigation/navbar';
// import Breadcrumb from '../../navigation/breadcrumb';
// import { Switch } from 'react-router-dom';
// import { buildRoutes } from '../../utils/routing';
// import Footer from '../../footer';

const eachNth = <T,>(arr: T[], n: number, from: number): T[] => arr.slice(from).filter((e, i) => i % n === 0);

export interface DeckCard extends SmallDeckCard {
  path: string;
}

export interface TrainingCardInfo {
  overdue: OverdueType;
  trainingCardsInfo: TrainingCardsInfoP;
}

export interface TrainingCardP extends DeckCard, TrainingCardInfo {}

const TrainingCard = ({ overdue, deckColor, deckName, path, trainingCardsInfo }: TrainingCardP) => {
  return (
    <div className="training-card">
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <Overdue type={overdue} />
      <span className="deck-path">{path}</span>
      <strong className="deck-name">{deckName}</strong>
      <TrainingCardsInfo {...trainingCardsInfo} />
    </div>
  );
};

export interface TrainingCardsP {
  rootDeckName: string;
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

const TrainingCards = ({ rootDeckName, trainings }: TrainingCardsP) => {
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
  const collapseId = rnd(1e3);
  return (
    <div className="training-cards mb-3">
      <div className="heading d-flex justify-content-between">
        <button
          className="transparent-button collapse-btn"
          data-bs-toggle="collapse"
          data-bs-target={'#c' + collapseId}
        >
          <CollapseI />
        </button>
        <h3 className={'me-auto ' + subheaderNames}>{rootDeckName}</h3>
        <TrainingsFilterBtn currentOption={option} setCurrentOption={filter} />
      </div>
      <div className="collapse show" id={'c' + collapseId}>
        <div className="d-flex flex-column cards">
          {displayedTrainings.map((e, i) => (
            <TrainingCard {...e} key={i} />
          ))}
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
    path: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    path: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    path: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    path: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    path: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const jsTrainings = [
  {
    overdue: OverdueType.Danger,
    deckColor: '#FCA95C',
    deckName: 'Functions',
    path: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#FCA95C',
    deckName: 'Functions',
    path: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#FCA95C',
    deckName: 'Workers',
    path: 'Browsers',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#eced2b',
    deckName: 'Async & Await',
    path: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#eced2b',
    deckName: 'Proxy',
    path: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#eced2b',
    deckName: 'Proxy',
    path: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const englishTrainings = [
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    path: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    path: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    path: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    path: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    path: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const cppTrainings = [
  {
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    path: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    path: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    path: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const pythonTrainings = [
  {
    overdue: OverdueType.None,
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    path: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.None,
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    path: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const cookingTrainings = [
  {
    overdue: OverdueType.Danger,
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    path: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    overdue: OverdueType.Warning,
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    path: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];

const decks = [
  { name: 'Math', trainings: mathTrainings },
  { name: 'Js', trainings: jsTrainings },
  { name: 'English', trainings: englishTrainings },
  { name: 'C++', trainings: cppTrainings },
  { name: 'Python', trainings: pythonTrainings },
  { name: 'Cooking', trainings: cookingTrainings },
];

const Sandbox = () => {
  return (
    // <div style={{ width: '100vw', height: '100vh', padding: '300px 300px', backgroundColor: 'white' }}>
    //   <TrainingCards rootDeckName="Math" trainings={trainings} />
    // </div>
    <div className="d-flex decks-to-train">
      {[0, 1, 2].map((i) => (
        <div className="col-2 me-4" key={i}>
          {eachNth(decks, 3, i).map((e, j) => (
            <TrainingCards rootDeckName={e.name} trainings={e.trainings} key={j} />
          ))}
        </div>
      ))}
    </div>
    // <>
    //   <NavBar />
    //   <main className="content-area">
    //     <Breadcrumb />
    //     <div className="con" />
    //     <Footer className="footer" />
    //   </main>
    // </>
  );
};

export { Sandbox };
