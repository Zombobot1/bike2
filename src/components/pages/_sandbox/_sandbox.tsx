import './_sandbox.scss';
import React, { ReactNode, useState } from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import { capitalizeFirstLetter, cn, getIds } from '../../../utils/utils';
import { sslugify } from '../../../utils/sslugify';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';
import { uformAtom, UFormState, useUForm } from './uform';
import { useMount } from '../../../utils/hooks-utils';
import SubmitBtn from '../../forms/submit-btn';
import { findAll, safeSplit, shuffle } from '../../../utils/algorithms';
import { useAtomDevtools } from 'jotai/devtools';

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
export interface RadioElementP {
  name: string;
  label: string;
  onChange: (v: string) => void;
  validity: Validity;
}
export const URadioElement = ({ name, label, validity, onChange }: RadioElementP) => {
  const id = `${name}-${sslugify(label)}`;
  const cns = cn('form-check-input', {
    'is-valid': validity === 'VALID',
    'is-invalid': validity === 'INVALID',
  });
  return (
    <div className="form-check uradio__input">
      <input className={cns} type="radio" name={name} value={label} onClick={() => onChange(label)} id={id} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export interface Question {
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface RadioData extends Question {
  options: string[];
}

export const URadio = ({ question, correctAnswer, explanation, options }: RadioData) => {
  const name = sslugify(question);
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { validationError, value, showAnswer } = getFieldInfo(name);

  useMount(() => {
    addField(name, correctAnswer);
    return () => removeField(name);
  });

  return (
    <div className="uradio">
      <p className="interactive-question">{question}</p>
      {options.map((o, i) => {
        let validity: Validity = 'NONE';
        if (validationError) validity = 'INVALID';
        else if (showAnswer && value !== correctAnswer) {
          if (o === correctAnswer) validity = 'VALID';
          else if (o === value) validity = 'INVALID';
          else validity = 'NONE';
        } else if (showAnswer && value === correctAnswer) validity = value === o ? 'VALID' : 'NONE';
        return <URadioElement key={i} name={name} label={o} validity={validity} onChange={(v) => onChange(name, v)} />;
      })}
      {validationError && <p className="radio__error">{validationError}</p>}
      {showAnswer && value !== correctAnswer && <p className="radio__error">{explanation}</p>}
      {showAnswer && value === correctAnswer && <p className="radio__success">{explanation}</p>}
    </div>
  );
};

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

export interface UInputElementP {
  name: string;
  value: string;
  label: string;
  onChange: (v: string) => void;
  validity: Validity;
  feedBack?: string;
}
export const UInputElement = ({ name, value, label, validity, feedBack = '', onChange }: UInputElementP) => {
  const id = `${name}-${sslugify(label)}`;

  return (
    <>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        className={cn('form-control', { 'is-valid': validity === 'VALID', 'is-invalid': validity === 'INVALID' })}
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={id}
      />
      {validity === 'INVALID' && <div className="invalid-feedback">{feedBack}</div>}
      {validity === 'VALID' && <div className="valid-feedback">{feedBack}</div>}
    </>
  );
};

export const UInput = ({ question, correctAnswer, explanation }: Question) => {
  const name = sslugify(question);
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { value, validationError, showAnswer } = getFieldInfo(name);

  let validity: Validity = 'NONE';
  if (validationError) validity = 'INVALID';
  else if (showAnswer) validity = value === correctAnswer ? 'VALID' : 'INVALID';

  useMount(() => {
    addField(name, correctAnswer);
    return () => removeField(name);
  });

  return (
    <UInputElement
      name={name}
      value={value}
      label={question}
      onChange={(s) => onChange(name, s)}
      validity={validity}
      feedBack={validationError ? validationError : explanation}
    />
  );
};

const UF = () => {
  const { submit, isSubmitted } = useUForm((e) => console.log(e[0]));

  return (
    <>
      <RadioField data={'Q?\n  () wrong (*) right\n  Cuz'} isCurrent={true} />
      <SubmitBtn onClick={submit} />
      <p>{String(isSubmitted)}</p>
    </>
  );
};

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);

  useAtomDevtools<UFormState>(uformAtom);

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
        <UF />

        {/*<TrainingContainer />*/}
      </main>
    </>
  );
};

export { Sandbox };
