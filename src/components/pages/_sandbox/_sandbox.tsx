import './_sandbox.scss';
import React, { ReactNode } from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import { catchError, cn, getIds } from '../../../utils/utils';
import { FieldT } from '../../study/training/types';
import { sslugify } from '../../../utils/sslugify';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';
import { JSObject } from '../../../utils/types';
import { EstimationsP, useUForm } from './uform';
import { useMount } from '../../../utils/hooks-utils';
import SubmitBtn from '../../forms/submit-btn';

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
  name: string;
  label: string;
  onChange: (v: string) => void;
  validity: Validity;
}
export const URadioElement = ({ name, label, validity, onChange }: RadioElementP) => {
  const id = `${name}-${sslugify(label)}`;
  return (
    <div className="form-check">
      <input
        className={cn('form-check-input', { 'is-valid': validity === 'VALID', 'is-invalid': validity === 'INVALID' })}
        type="radio"
        name={name}
        value={label}
        onClick={() => {
          console.log('clicked', label);
          onChange(label);
        }}
        id={id}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export interface RadioData {
  question: string;
  options: string[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RadioP extends RadioData {
  name: string;
}

export const URadio = ({ name, question, options }: RadioP) => {
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { validationError, value, correctAnswer, feedback } = getFieldInfo(name);

  useMount(() => {
    addField(name);
    return () => removeField(name);
  });

  return (
    <div className="radio">
      <p className="interactive-question">{question}</p>
      {options.map((o, i) => {
        let validity: Validity = 'NONE';
        if (validationError) validity = 'INVALID';
        else if (correctAnswer && feedback) {
          if (o === correctAnswer) validity = 'VALID';
          else if (o === value) validity = 'INVALID';
          else validity = 'NONE';
        } else if (!correctAnswer && feedback) validity = value === o ? 'VALID' : 'NONE';
        return <URadioElement key={i} name={name} label={o} validity={validity} onChange={(v) => onChange(name, v)} />;
      })}
      {validationError && <p className="radio__error">{validationError}</p>}
      {correctAnswer && <p className="radio__error">{feedback}</p>}
      {!correctAnswer && feedback && <p className="radio__success">{feedback}</p>}
    </div>
  );
};

// const OPTIONS_R = /(?:\([*]*\) |\(\([*]*\)\) )/gm;
// const RADIO_SEP = '\n';
// const radioParser = (data: string): RadioData => {
//   const parts = safeSplit(data, RADIO_SEP);
//   if (parts.length < 2) throw new Error('Bad radio data');
//
//   const options = safeSplit(parts[1], OPTIONS_R);
//   const correctOptionIndex = findAll(data, OPTIONS_R).findIndex((s) => s.includes('*'));
//   return { question: parts[0], options, correctOption: options[correctOptionIndex], validFeedback: parts[2] };
// };
//
export interface RadioFieldP {
  data: string;
}
export const RadioField = ({ data: _data }: RadioFieldP) => {
  return null;
  // const [{ question, options, correctOption, validFeedback }] = useState(radioParser(data));
  // return (
  //   <Radio
  //     question={question}
  //     radioName="radio"
  //     options={shuffle(options)}
  //     correctOption={correctOption}
  //     checkValidity={false}
  //     validFeedback={validFeedback}
  //   />
  // );
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

export interface UInputP {
  name: string;
  question: string;
}

export const UInput = ({ name, question }: UInputP) => {
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { value, validationError, feedback } = getFieldInfo(name);

  let validity: Validity = 'NONE';
  if (validationError) validity = 'INVALID';
  else if (feedback) validity = 'VALID';

  useMount(() => {
    addField(name);
    return () => removeField(name);
  });

  return (
    <UInputElement
      name={name}
      value={value}
      label={question}
      onChange={(s) => onChange(name, s)}
      validity={validity}
      feedBack={validationError ? validationError : feedback}
    />
  );
};

const UForm = () => {
  const onSubmit = async (data: JSObject): EstimationsP => {
    console.log(data);
    return [{ name: 'radio', correctAnswer: 'o3', feedback: 'Wrong' }];
  };

  const { submit } = useUForm(onSubmit);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit().catch(catchError);
      }}
    >
      {/*<UInput name="text" question="Enter sth" />*/}
      <URadio name={'radio'} question={'Select sth'} options={['o1', 'o2', 'o3']} />
      <SubmitBtn className="mt-3" text="Send" />
    </form>
  );
};

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);

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
        <UForm />

        {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
        {/*  <Radio*/}
        {/*    radioName={name}*/}
        {/*    register={reg}*/}
        {/*    question={'Important question'}*/}
        {/*    options={['Right', 'Wrong', 'Also wrong']}*/}
        {/*    errors={errors}*/}
        {/*  />*/}
        {/*  <input type="submit" />*/}
        {/*</form>*/}
      </main>
    </>
  );
};

export { Sandbox };
