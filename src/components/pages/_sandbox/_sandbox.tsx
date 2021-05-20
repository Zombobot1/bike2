import './_sandbox.scss';
import React, { ReactNode } from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import { cn, getIds } from '../../../utils/utils';
import { FieldT } from '../../study/training/types';
import { sslugify } from '../../../utils/sslugify';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';
import { DeepMap, FieldError, useForm, UseFormRegisterReturn } from 'react-hook-form';
import { JSObject } from '../../../utils/types';

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
  register: UseFormRegisterReturn;
  validity?: Validity;
  validFeedBack?: string;
  invalidFeedBack?: string;
}
export const RadioElement = ({
  radioName,
  label,
  register,
  validity = 'NONE',
  validFeedBack,
  invalidFeedBack,
}: RadioElementP) => {
  const id = `${radioName}-${sslugify(label)}`;
  const cns = cn('form-check-input', { 'is-valid': validity === 'VALID', 'is-invalid': validity === 'INVALID' });
  return (
    <div className="form-check">
      <input className={cns} type="radio" {...register} value={label} id={id} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
      {validFeedBack && <div className="valid-feedback">{validFeedBack}</div>}
      {invalidFeedBack && <div className="invalid-feedback">{invalidFeedBack}</div>}
    </div>
  );
};

export interface RadioData {
  question: string;
  options: string[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Errors = DeepMap<Record<string, any>, FieldError>;
export interface RadioP extends RadioData {
  radioName: string;
  register: UseFormRegisterReturn;
  errors: Errors;
}

export const Radio = ({ question, radioName, options, register, errors }: RadioP) => {
  const error = errors[radioName]?.message;
  return (
    <div className={cn('radio', { 'radio--error': error })}>
      <p className="interactive-question">{question}</p>
      {options.map((o, i) => {
        return <RadioElement radioName={radioName} label={o} key={i} register={register} />;
      })}
      {error && <p className="radio__error">{error}</p>}
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

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: JSObject) => console.log(data);

  const name = 'radio' as const;
  const reg = register(name, { validate: () => (getValues(name) ? true : 'Please select something!') });

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Radio
            radioName={name}
            register={reg}
            question={'Important question'}
            options={['Right', 'Wrong', 'Also wrong']}
            errors={errors}
          />
          <input type="submit" />
        </form>
      </main>
    </>
  );
};

export { Sandbox };
