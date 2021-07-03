import { SQACard } from '../components/study/training/qa-card/qa-card-stories';
import { STraining } from '../components/study/training/training/training-stories';
import { STrainingHeader } from '../components/study/training/training-header/training-header-stories';
import { storify } from './utils';
import { STrainingControls } from '../components/study/training/training-controls/training-controls-stories';
import { SField } from '../components/study/training/qa-card/field/field-stories';
import { SUFormHook } from '../components/uform/uform-stories';
import { SUInputElement, SUChecksElement } from '../components/uform/ufields/ufields-stories';
import { SControls } from '../components/utils/controls-s';
import { STrainingTimer } from '../components/study/training/training-timer/trainingTimerStories';

export const sories = [
  {
    name: 'Training',
    components: [
      storify({ STraining }),
      storify({ STrainingHeader }),
      storify({ SQACard }),
      storify({ SField }),
      storify({ STrainingControls }),
      storify({ STrainingTimer }),
    ],
  },
  {
    name: 'UForm',
    components: [storify({ SUFormHook }), storify({ SUChecksElement }), storify({ SUInputElement })],
  },
  {
    name: 'Utils',
    components: [storify({ SControls })],
  },
];
