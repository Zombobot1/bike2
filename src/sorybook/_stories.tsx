import { SQACard } from '../components/study/training/qa-card/qa-card-stories';
import { STraining } from '../components/study/training/training/training-stories';
import { STrainingHeader } from '../components/study/training/training-header/training-header-stories';
import { storify } from './utils';
import { STrainingControls } from '../components/study/training/training-controls/training-controls-stories';
import { SField } from '../components/study/training/qa-card/field/field-stories';
import { SModal } from '../components/utils/modal-stories';
import { SUFormHook, SUradio } from '../components/uform/uform-stories';

export const sories = [
  {
    name: 'Training',
    components: [
      storify({ STraining }),
      storify({ STrainingHeader }),
      storify({ STrainingControls }),
      storify({ SQACard }),
      storify({ SField }),
    ],
  },
  {
    name: 'UForm',
    components: [storify({ SUFormHook }), storify({ SUradio })],
  },
  {
    name: 'Utils',
    components: [storify({ SModal })],
  },
];
