import './_sandbox.scss';
import React, { ReactNode, useState } from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import { capitalizeFirstLetter, getIds } from '../../../utils/utils';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';
import { fieldsAtom } from './uform';
import { findAll, safeSplit, shuffle } from '../../../utils/algorithms';
import { useAtomDevtools } from 'jotai/devtools';
import { RadioData, URadio } from '../../uform/ufields/uradio';
import { NoDataRaceOnAddRemove } from '../../../stories/tuform.stories';

const id = getIds();

type RecP = { width?: number; height?: number; color?: string; isHidden?: boolean; _id?: string; children?: ReactNode };
const Rec = ({ height = 100, width = 200, color = 'red', isHidden = false, _id = id(), children }: RecP) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        display: isHidden ? 'none' : 'block',
      }}
    >
      {children}
    </div>
  );
};

export type Validity = 'VALID' | 'INVALID' | 'NONE';

const OPTIONS_R = /(?:\([*]*\) |\(\([*]*\)\) )/gm;
const RADIO_SEP = '\n';
const radioParser = (data: string): RadioData => {
  const parts = safeSplit(data, RADIO_SEP);
  if (parts.length < 2) throw new Error('Bad radio data');

  const options = safeSplit(parts[1], OPTIONS_R).map((o) => capitalizeFirstLetter(o));
  const correctOptionIndex = findAll(data, OPTIONS_R).findIndex((s) => s.includes('*'));
  return {
    question: capitalizeFirstLetter(parts[0]),
    options,
    correctAnswer: options[correctOptionIndex],
    explanation: parts[2],
  };
};

const radioParserShuffled = (data: string): RadioData => {
  const result = radioParser(data);
  return { ...result, options: shuffle(result.options) };
};

export interface RadioFieldP {
  data: string;
  isCurrent: boolean;
}

export const RadioField = ({ data, isCurrent }: RadioFieldP) => {
  if (!isCurrent) return null;
  const [{ question, options, explanation, correctAnswer }] = useState(radioParserShuffled(data));
  return <URadio question={question} options={options} correctAnswer={correctAnswer} explanation={explanation} />;
};

// const UF = () => {
//   const { submit, isSubmitted } = useUForm((e) => console.log(e[0]));
//
//   return (
//     <>
//       <RadioField data={'Q?\n  () wrong (*) right\n  Cuz'} isCurrent={true} />
//       <SubmitBtn onClick={submit} />
//       <p>{String(isSubmitted)}</p>
//     </>
//   );
// };

export const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);

  useAtomDevtools(fieldsAtom);

  return (
    // <div
    //   style={{ width: '500px', height: '85vh', position: 'relative', padding: '50px 50px', backgroundColor: COLORS.bg }}
    // >
    //   {/*<QACard fields={[field1]} stageColor={'red'} side={'FRONT'} />*/}
    // </div>
    <>
      <NavBar visibility={navBarVisibility} toggleVisibility={toggleNavBarVisibility} />
      <Breadcrumb toggleNavbarVisibility={toggleNavBarVisibility} />
      <main className="content-area">
        <Rec _id={id()} isHidden={true} />
        <NoDataRaceOnAddRemove
          questions={[{ question: 'Question 1', correctAnswer: 'right', explanation: 'Cuz' }]}
          isExtensible={true}
        />
        {/*<TrainingContainer />*/}
      </main>
    </>
  );
};
