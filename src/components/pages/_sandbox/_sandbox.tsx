import './_sandbox.scss';
import React, { ReactNode, useState } from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import { cn, getIds } from '../../../utils/utils';
import { FieldT } from '../../study/training/types';
import { sslugify } from '../../../utils/sslugify';
import { findAll, safeSplit, shuffle } from '../../../utils/algorithms';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';

const id = getIds();

type RecP = { width?: number; height?: number; color?: string; isHidden?: boolean; _id?: string; children?: ReactNode };
const Rec = ({ height = 100, width = 200, color = 'red', isHidden = false, _id = id(), children }: RecP) => (
  <div
    style={{ width: `${width}px`, height: `${height}px`, backgroundColor: color, display: isHidden ? 'none' : 'block' }}
  >
    {children}
  </div>
);

const selection = 'Please select one:\n () option1 (*) option2\n  Right!';

export const field1: FieldT = {
  type: 'RADIO',
  data: selection,
  side: 'FRONT',
};

export const field2: FieldT = {
  type: 'PRE',
  data:
    'awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj awdijawidjoiawjdoaiwj ',
  side: 'FRONT',
};

export type Validity = 'VALID' | 'INVALID' | 'NONE';
export interface RadioElementP {
  radioName: string;
  label: string;
  validity: Validity;
  validFeedBack?: string;
}
export const RadioElement = ({ radioName, label, validity, validFeedBack }: RadioElementP) => {
  const id = `${radioName}-${sslugify(label)}`;
  const cns = cn('form-check-input', { 'is-valid': validity === 'VALID', 'is-invalid': validity === 'INVALID' });
  return (
    <div className="form-check">
      <input className={cns} type="radio" name={radioName} id={id} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
      {validFeedBack && <div className="valid-feedback">{validFeedBack}</div>}
    </div>
  );
};

export interface RadioData {
  question: string;
  options: string[];
  correctOption: string;
  validFeedback?: string;
}

export interface RadioP extends RadioData {
  radioName: string;
  checkValidity: boolean;
}

export const Radio = ({ question, radioName, options, correctOption, validFeedback, checkValidity }: RadioP) => {
  return (
    <>
      <p className="interactive-question">{question}</p>
      {options.map((o, i) => {
        let validity: Validity = 'NONE';
        if (checkValidity) validity = o === correctOption ? 'VALID' : 'INVALID';
        return (
          <RadioElement radioName={radioName} label={o} key={i} validity={validity} validFeedBack={validFeedback} />
        );
      })}
    </>
  );
};

const OPTIONS_R = /(?:\([*]*\) |\(\([*]*\)\) )/gm;
const RADIO_SEP = '\n';
const radioParser = (data: string): RadioData => {
  const parts = safeSplit(data, RADIO_SEP);
  if (parts.length < 2) throw new Error('Bad radio data');

  const options = safeSplit(parts[1], OPTIONS_R);
  const correctOptionIndex = findAll(data, OPTIONS_R).findIndex((s) => s.includes('*'));
  return { question: parts[0], options, correctOption: options[correctOptionIndex], validFeedback: parts[2] };
};

export interface RadioFieldP {
  data: string;
}
export const RadioField = ({ data }: RadioFieldP) => {
  const [{ question, options, correctOption, validFeedback }] = useState(radioParser(data));
  return (
    <Radio
      question={question}
      radioName="radio"
      options={shuffle(options)}
      correctOption={correctOption}
      checkValidity={false}
      validFeedback={validFeedback}
    />
  );
};

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);
  return (
    // <div style={{ width: '500px', height: '85vh', position: 'relative', padding: '0', backgroundColor: COLORS.bg }}>
    //   <Rec>
    //     <RadioElement validity={'NONE'} label={'label'} radioName={'r'} />
    //   </Rec>
    //   // {/*<QACard fields={[field1]} stageColor={'red'} side={'FRONT'} />*/}
    // </div>
    <>
      <NavBar visibility={navBarVisibility} toggleVisibility={toggleNavBarVisibility} />
      <Breadcrumb toggleNavbarVisibility={toggleNavBarVisibility} />
      <main className="content-area">
        <Rec _id={id()} isHidden={true} />
      </main>
    </>
  );
};

export { Sandbox };
