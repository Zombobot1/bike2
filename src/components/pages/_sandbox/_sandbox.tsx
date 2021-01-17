import './_sandbox.scss';
import React, { useEffect, useState } from 'react';
import NavBar from '../../navigation/navbar';
import Breadcrumb from '../../navigation/breadcrumb';
import Footer from '../../footer';
import { COLORS } from '../../../config';
import { useToggle } from '../../utils/hooks/use-toggle';
import { addS, fancyNumber, percentage } from '../../../utils/formatting';
import { ReactComponent as Dots } from './three-dots-icon.svg';
import { ReactComponent as TimerI } from './hourglass-split.svg';
import { ReactComponent as QuestionI } from './question-icon.svg';
import { StateT } from '../../forms/hoc/with-validation';
import { useRouter } from '../../utils/hooks/use-router';
import { STUDY } from '../index';

const question = `The English language is conventionally divided into three historical periods. In which of these periods did William Shakespeare write his plays?


(a) Old English
(b) Middle English
(c) Modern English`;

const answer = `(c) The period of Modern English extends from the 1500s to the present day. Shakespeare wrote his plays between 1590 and 1613.`;

enum CardSide {
  Front,
  Back,
}

export interface CardT {
  id: string;
  question: string;
  answer: string;
  timeout: number;
  stageColor: string;
}

export interface CardP {
  question: string;
  answer: string;
  stageColor: string;
  side: CardSide;
}

enum TrainingType {
  Learning,
  Repeating,
}

export interface TrainingP {
  deckName: string;
  type: TrainingType;
  cards: CardT[];
}

export interface ProgressBarP {
  className?: string;
  value: number;
  color: string;
}

const ProgressBar = ({ className, color, value }: ProgressBarP) => (
  <div className={className + ' progress'}>
    <div className="progress-bar" style={{ width: percentage(value), backgroundColor: color }} />
  </div>
);

const fancyTime = (secs: number) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + secs);
  const delta = Math.round((+now - +new Date()) / 1000);

  const minute = 60;
  const hour = minute * 60;

  let deltaMins = Math.floor(delta / minute);
  const deltaHrs = Math.floor(delta / hour);

  if (delta < minute) return `${delta} sec${addS(delta)}`;
  if (delta < hour) return `${deltaMins} min${addS(deltaMins)}`;
  deltaMins = Math.floor((delta - deltaHrs * hour) / minute);
  return `${deltaHrs} hr${addS(deltaHrs)} ${deltaMins} min${addS(deltaMins)}`;
};

const div = (num: number, denom: number) => Math.floor(num / denom);

const format00 = (num: number) => (!div(num, 10) ? `0${num}` : `${num}`);

const fancyTimerTime = (secs_: number) => {
  const mins = div(secs_, 60);
  const secs = secs_ - mins * 60;
  if (mins === 0) return `00:${format00(secs)}`;
  return `${format00(mins)}:${format00(secs)}`;
};

const Card = ({ question, answer, stageColor, side }: CardP) => {
  return (
    <div className="qa-card-container">
      <div className="qa-card">
        <pre>{side === CardSide.Front ? question : answer}</pre>
      </div>
      <div className="qa-card-bottom" style={{ backgroundColor: stageColor }} />
    </div>
  );
};

enum AnswerEstimation {
  Bad,
  Poor,
  Good,
  Easy,
}

export interface TrainingControlsP {
  cardSideS: StateT<CardSide>;
  timeoutSec: number;
  estimate: (v: AnswerEstimation) => void;
  nextCard: () => void;
}

const useInterval = (f: () => void, ms: number, deps: unknown[] = []) => {
  const [id, setId] = useState<NodeJS.Timeout>();
  useEffect(() => {
    const id_ = setInterval(f, ms);
    setId(id_);
    return () => clearInterval(id_);
  }, deps);
  return id;
};

export interface TrainingTimerP {
  timeoutSec: number;
}

const TrainingTimer = ({ timeoutSec }: TrainingTimerP) => {
  const [secsLeft, setSecsLeft] = useState(timeoutSec);
  console.log({ timeoutSec, secsLeft });
  const id = useInterval(() => setSecsLeft((s) => s - 1), 1000);
  if (id && secsLeft < 1) clearInterval(id);
  return (
    <div className="d-flex timer">
      <TimerI />
      <span className="align-self-center">{fancyTimerTime(secsLeft)}</span>
    </div>
  );
};

export interface EstimationBtnP {
  btnClass: string;
  estimation: AnswerEstimation;
  estimate: (v: AnswerEstimation) => void;
}

const EstimationBtn = ({ btnClass, estimate, estimation }: EstimationBtnP) => (
  <button type="button" className={'btn ' + btnClass} onClick={() => estimate(estimation)}>
    {AnswerEstimation[estimation]}
  </button>
);

const TrainingControls = ({ cardSideS, timeoutSec, nextCard, estimate }: TrainingControlsP) => {
  const [cardSide, setCardSide] = cardSideS;
  const makeEstimation = (e: AnswerEstimation) => {
    if (autoFailInterval) clearInterval(autoFailInterval);
    estimate(e);
    nextCard();
  };
  const autoFailInterval = useInterval(() => makeEstimation(AnswerEstimation.Bad), timeoutSec * 1000);

  return (
    <div className="controls">
      <TrainingTimer timeoutSec={timeoutSec} />
      {cardSide === CardSide.Front && (
        <button className="btn btn-lg btn-primary" onClick={() => setCardSide(CardSide.Back)}>
          Estimate
        </button>
      )}
      {cardSide === CardSide.Back && (
        <div className="btn-group" role="group">
          <EstimationBtn btnClass="btn-danger" estimate={makeEstimation} estimation={AnswerEstimation.Bad} />
          <EstimationBtn btnClass="btn-warning" estimate={makeEstimation} estimation={AnswerEstimation.Poor} />
          <EstimationBtn btnClass="btn-success" estimate={makeEstimation} estimation={AnswerEstimation.Good} />
          <EstimationBtn btnClass="btn-info" estimate={makeEstimation} estimation={AnswerEstimation.Easy} />
        </div>
      )}
    </div>
  );
};

const Training = ({ cards, deckName, type }: TrainingP) => {
  const { history } = useRouter();
  const [currentCardNumber, setCurrentCardNumber] = useState(0);
  const nextCard = () => {
    if (currentCardNumber === cards.length - 1) history.push(STUDY);
    setCurrentCardNumber((n) => n + 1);
    setCardSide(CardSide.Front);
  };
  const timeToFinish = cards.slice(currentCardNumber).reduce((p, e) => p + e.timeout, 0);
  const [cardSide, setCardSide] = useState(CardSide.Front);
  const estimate = (e: AnswerEstimation) => console.info('estimation: ' + AnswerEstimation[e]);
  return (
    <div className="d-flex flex-column training">
      <h3 className="header">{(type === TrainingType.Learning ? 'Learning ' : 'Training ') + deckName}</h3>
      <div className="d-flex">
        <ProgressBar
          className="align-self-center me-2"
          value={currentCardNumber / cards.length}
          color={COLORS.tertiary}
        />
        <span className="align-self-center me-auto cards-left-info">
          {fancyNumber(cards.length - currentCardNumber)} card{addS(cards.length)} left. You need{' '}
          {fancyTime(timeToFinish)} to finish.
        </span>
        <Dots className="transparent-button three-dots-icon" />
      </div>
      <Card {...cards[currentCardNumber]} side={cardSide} />
      <TrainingControls
        cardSideS={[cardSide, setCardSide]}
        timeoutSec={cards[currentCardNumber].timeout}
        estimate={estimate}
        nextCard={nextCard}
      />
      {/*<QuestionI />*/}
    </div>
  );
};
const training = {
  deckName: 'Exercises 1-10',
  type: TrainingType.Learning,
  cards: [
    {
      id: '1',
      question,
      answer,
      timeout: 3,
      stageColor: 'red',
    },
    {
      id: '2',
      question,
      answer,
      timeout: 10,
      stageColor: 'blue',
    },
  ],
};
type SP = { timeoutSec: number };
const S = ({ timeoutSec }: SP) => {
  return <TrainingTimer timeoutSec={timeoutSec} />;
};
type SSP = {
  secs: number[];
};
const SS = ({ secs }: SSP) => {
  const [c, sc] = useState(0);
  const n = () => {
    console.log('n');
    sc((c) => c + 1);
  };
  const id = useInterval(n, secs[c] * 1000);
  return <S timeoutSec={secs[c]} />;
};

const C = (n_: number) => {
  const [n, sn] = useState(n_);
  return <button onClick={() => sn((n) => n + 1)}>{'' + n}</button>;
};

const CC = () => {
  const [n, sn] = useState(12);
  useEffect(() => console.log('opa', n), [n]);
  return (
    <>
      <button onClick={() => sn((n) => n + 1)}>+</button>
      {C(n)}
    </>
  );
};

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(true);
  return (
    <div style={{ width: '100vw', height: '100vh', padding: '100px 100px', backgroundColor: COLORS.bg }}>
      <CC />
      {/*<SS secs={[3, 2]} />*/}
      {/*<Training {...training} />*/}
    </div>
    // <>
    //   <NavBar visibility={navBarVisibility} toggleVisibility={toggleNavBarVisibility} />
    //   <Breadcrumb toggleNavbarVisibility={toggleNavBarVisibility} />
    //   <main className="content-area">
    //     <Footer className="footer" />
    //   </main>
    // </>
  );
};

export { Sandbox };
