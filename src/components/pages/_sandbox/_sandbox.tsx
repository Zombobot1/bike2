import './_sandbox.scss';
import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../../navigation/navbar';
import Breadcrumb from '../../navigation/breadcrumb';
import Footer from '../../footer';
import { COLORS, MEDIA } from '../../../config';
import { useToggle } from '../../utils/hooks/use-toggle';
import { addS, fancyNumber, percentage } from '../../../utils/formatting';
import { ReactComponent as Dots } from './three-dots-icon.svg';
import { ReactComponent as BackI } from './next-gen/arrow-left-short.svg';
import { ReactComponent as TimerI } from './hourglass-split.svg';
import { ReactComponent as StopTimerI } from './hourglass.svg';
import { ReactComponent as EditI } from './pen.svg';
import { ReactComponent as MarkI } from './patch-exclamation.svg';
import { ReactComponent as FullScreenI } from './bi-arrows-fullscreen.svg';
import { ReactComponent as ExitFullScreenI } from './bi-fullscreen-exit.svg';
import { ReactComponent as QuestionI } from './question-icon.svg';
import { StateT } from '../../forms/hoc/with-validation';
import { useRouter } from '../../utils/hooks/use-router';
import { STUDY } from '../index';
import { cn } from '../../../utils/utils';
import { usePagesInfoDispatch } from '../../context/user-position-provider';
import * as screenfull from 'screenfull';
import { Screenfull } from 'screenfull';

const fs = () => screenfull as Screenfull;

const question = `The English language is conventionally divided into three historical periods. In which of these periods did William Shakespeare write his plays?


(a) Old English
(b) Middle English
(c) Modern English
`;

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
  id: string;
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

  if (delta < minute) return `~${delta} sec${addS(delta)}`;
  if (delta < hour) return `${deltaMins} min${addS(deltaMins)}`;
  deltaMins = Math.floor((delta - deltaHrs * hour) / minute);
  return `${deltaHrs} hr${addS(deltaHrs)} ${deltaMins} min${addS(deltaMins)}`;
};

const div = (num: number, denom: number) => Math.floor(num / denom);

const format00 = (num: number) => (!div(num, 10) ? `0${num}` : `${num}`);

const fancyTimerTime = (secs_: number) => {
  const mins = div(secs_, 60);
  const secs = secs_ - mins * 60;
  if (secs < 0 || mins < 0) return '00:00';
  if (mins === 0) return `00:${format00(secs)}`;
  if (mins > 99) return `99:99`;
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

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void | null>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    const tick = () => {
      if (typeof savedCallback?.current !== 'undefined') savedCallback?.current();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export interface TrainingTimerP {
  timeout: { sec: number };
  onTimeout: () => void;
}

const useEffectedState = <T,>(init: T): StateT<T> => {
  const [state, setState] = useState(init);
  useEffect(() => setState(init), [init]);
  return [state, setState];
};

const TrainingTimer = ({ timeout, onTimeout }: TrainingTimerP) => {
  const [secsLeft, setSecsLeft] = useEffectedState(timeout);
  useInterval(() => setSecsLeft((s) => ({ sec: s.sec - 1 })), 1000);
  useEffect(() => {
    if (secsLeft.sec < 0) onTimeout();
  }, [secsLeft]);
  return (
    <div className="timer">
      <TimerI />
      <span className="text">{fancyTimerTime(secsLeft.sec)}</span>
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
    estimate(e);
    nextCard();
  };
  const fail = () => makeEstimation(AnswerEstimation.Bad);

  const backICN = cn('bi bi-arrow-left-short transparent-button', { invisible: cardSide === CardSide.Front });
  return (
    <div className="d-flex justify-content-between align-items-center controls">
      <BackI className={backICN} onClick={() => setCardSide(CardSide.Front)} />
      {cardSide === CardSide.Front && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={() => setCardSide(CardSide.Back)}>
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
      <TrainingTimer timeout={{ sec: timeoutSec }} onTimeout={fail} />
    </div>
  );
};

const TrainingSettings = () => (
  <>
    <div className="btn-group dropleft settings">
      <Dots className="dropdown-toggle transparent-button three-dots-icon" data-bs-toggle="dropdown" />
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <li>
          <span className="dropdown-item d-flex align-items-center">
            <MarkI />
            Mark
          </span>
        </li>
        <li>
          <span className="dropdown-item d-flex align-items-center">
            <EditI />
            Edit
          </span>
        </li>
        <li>
          <span className="dropdown-item d-flex align-items-center">
            <StopTimerI />
            Stop timer
          </span>
        </li>
      </ul>
    </div>
  </>
);

const useMedia = <T,>(queries: string[], values: T[], defaultValue: T) => {
  const mediaQueryLists = queries.map((q) => window.matchMedia(q));
  const getValue = () => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    return values?.[index] || defaultValue;
  };
  const [value, setValue] = useState<T>(getValue);
  useEffect(() => {
    const handler = () => setValue(getValue);
    mediaQueryLists.forEach((mql) => mql.addEventListener('change', handler));
    return () => mediaQueryLists.forEach((mql) => mql.removeEventListener('change', handler));
  }, []);

  return value;
};

const FullScreenTrigger = () => {
  if (!screenfull.isEnabled) return null;
  const isMobile = useMedia([MEDIA.mobile], [false], true);
  const [full, toggle] = useToggle(false);
  useEffect(() => {
    if (full)
      fs()
        .request()
        .catch(() => ({}));
    else fs().exit().catch();
  }, [full]);
  return (
    <div className="transparent-button fs-trigger">
      {!full && isMobile && <FullScreenI onClick={toggle} />}
      {full && <ExitFullScreenI onClick={toggle} />}
    </div>
  );
};

export interface TrainingHeaderP {
  type: TrainingType;
  deckName: string;
  cards: CardT[];
  currentCardNumber: number;
}

const TrainingHeader = ({ cards, deckName, type, currentCardNumber }: TrainingHeaderP) => {
  const timeToFinish = cards.slice(currentCardNumber).reduce((p, e) => p + e.timeout, 0);
  return (
    <>
      <h3 className="header">{(type === TrainingType.Learning ? 'Learning ' : 'Training ') + deckName}</h3>
      <div className="d-flex align-items-center heading">
        <ProgressBar
          className="align-self-center me-2"
          value={currentCardNumber / cards.length}
          color={COLORS.tertiary}
        />
        <span className="align-self-center me-auto cards-left-info">{fancyTime(timeToFinish)} left.</span>
        <FullScreenTrigger />
        <TrainingSettings />
      </div>
    </>
  );
};

export const Training = ({ id, cards, deckName, type }: TrainingP) => {
  const { history } = useRouter();
  const [currentCardNumber, setCurrentCardNumber] = useState(0);
  const dispatch = usePagesInfoDispatch();
  dispatch({ type: 'SET', payload: { path: [{ id, name: deckName }] } });
  const nextCard = () => {
    if (currentCardNumber === cards.length - 1) {
      history.push(STUDY);
      dispatch({ type: 'CLEAR' });
    }
    setCurrentCardNumber((n) => n + 1);
    setCardSide(CardSide.Front);
  };
  const [cardSide, setCardSide] = useState(CardSide.Front);
  const estimate = (e: AnswerEstimation) => console.info('estimation: ' + AnswerEstimation[e]);
  return (
    <div className="d-flex flex-column training">
      <TrainingHeader type={type} deckName={deckName} cards={cards} currentCardNumber={currentCardNumber} />
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

export const training = {
  id: '1',
  deckName: 'Exercises 1-10',
  type: TrainingType.Learning,
  cards: [
    {
      id: '1',
      question,
      answer,
      timeout: 10,
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

export const TrainingContainer = () => {
  return (
    <div className="d-flex justify-content-center align-items-center training-container">
      <Training {...training} />
    </div>
  );
};

type RecP = { width?: number; height?: number; color?: string };
const Rec = ({ height = 50, width = 100, color = 'red' }: RecP) => (
  <div style={{ width: `${width}px`, height: `${height}px`, backgroundColor: color }} />
);

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(true);

  return (
    <div style={{ width: '100vw', height: '100vh', padding: '100px 200px', backgroundColor: COLORS.bg }}>
      <Training {...training} />
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
