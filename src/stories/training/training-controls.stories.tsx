import { Meta, Story } from '@storybook/react';
import { TrainingControls } from '../../components/study/training/training-controls';
import React, { useState } from 'react';
import { CardEstimation, CardType, estimationColor } from '../../components/study/training/types';
import { COLORS } from '../../config';

export default {
  title: 'Training/Training controls',
  component: TrainingControls,
} as Meta;

interface TemplateP {
  cardType: CardType;
  areFieldsHidden: boolean;
}

const Template = ({ cardType, areFieldsHidden }: TemplateP) => {
  const [areHidden, setHidden] = useState(areFieldsHidden);
  const [estimation, setEstimation] = useState<CardEstimation | null>(null);
  const [status, setStatus] = useState('');

  const estimatePassive = (e: CardEstimation) => {
    setEstimation(e);
    setHidden(true);
    return undefined;
  };

  const estimateInteractive = (_e: CardEstimation) => {
    setStatus('Ready to go further');
    return () => setStatus('This is next');
  };

  return (
    <div
      className="d-flex flex-column align-items-center pt-3 pb-3"
      style={{ width: '500px', backgroundColor: COLORS.light }}
    >
      {status && <h3 className="mb-3">{status}</h3>}
      {estimation && (
        <h3 className="mb-3" style={{ color: estimationColor(estimation) }}>
          {estimation}
        </h3>
      )}
      <TrainingControls
        cardType={cardType}
        showHiddenFields={() => setHidden(false)}
        areFieldsHidden={areHidden}
        estimate={cardType === 'PASSIVE' ? estimatePassive : estimateInteractive}
        currentCardIndex={0}
      />
    </div>
  );
};

const passiveCardControls: TemplateP = {
  cardType: 'PASSIVE',
  areFieldsHidden: true,
};

const interactiveCardControls: TemplateP = {
  cardType: 'INTERACTIVE',
  areFieldsHidden: true,
};

const Template_: Story<TemplateP> = (args) => <Template {...args} />;

export const PassiveCardControls = Template_.bind({});
PassiveCardControls.args = {
  ...passiveCardControls,
};

export const InteractiveCardControls = Template_.bind({});
InteractiveCardControls.args = {
  ...interactiveCardControls,
};
