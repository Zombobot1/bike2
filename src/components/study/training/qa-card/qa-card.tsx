import './qa-card.scss';
import React from 'react';
import { CardEstimation, estimationColor, FieldDTO } from '../types';
import { Field } from './field/field';
import { useMount } from '../../../../utils/hooks-utils';
import { Stack, styled, useTheme } from '@material-ui/core';

const preloadImage = (field: FieldDTO) => {
  if (field.type !== 'IMG' || !field.passiveData) return;
  const img = new Image();
  img.src = field.passiveData;
};

export interface QACardP {
  fields: FieldDTO[];
  stageColor: string;
  isCurrent: boolean;
  isMediaActive?: boolean;
  showHidden: boolean;
  estimation?: CardEstimation;
}

const EstimationBubble = styled('div')({
  position: 'absolute',
  top: 0,
  left: '100%',
  width: 100,
  height: 100,
  borderRadius: '50%',
  transform: 'translate(-80%, -30%)',
});

const Estimation = styled('span')(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: 20,
  display: 'inline-block',
  transform: 'translate(40px, 45px)',
}));

const CardContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  width: '100%',
  borderRadius: 25,
  border: `0.5px solid ${theme.palette.grey['200']}`,
}));

const Card = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  height: '97%',
  width: '100%',
  overflowY: 'auto',
  zIndex: 1,
  padding: 20,
  borderRadius: 25,
  ':after': {
    content: '""',
    margin: 'auto',
  },
  ':before': {
    content: '""',
    margin: 'auto',
  },
}));

const Hr = styled('hr')({
  minHeight: 1,
  marginTop: 0,
  opacity: 0.1,
});

export const QACard = ({ fields, stageColor, isCurrent, isMediaActive = true, showHidden, estimation }: QACardP) => {
  const fieldsToShow = fields.filter((f) => f.status === 'SHOW');
  const hiddenFields = fields.filter((f) => f.status === 'HIDE');

  const theme = useTheme();
  const white = theme.palette.common.white;
  const backgroundColors = `linear-gradient(${white} 0%, ${white} 92%, ${stageColor} 92%, ${stageColor} 100%)`;

  useMount(() => fields.forEach(preloadImage));

  return (
    <CardContainer sx={{ background: backgroundColors }}>
      {estimation && (
        <EstimationBubble sx={{ backgroundColor: estimationColor(estimation) }}>
          <Estimation>{estimation[0]}</Estimation>
        </EstimationBubble>
      )}
      <Card spacing={2}>
        {fieldsToShow.map((f, i) => (
          <Field
            _id={f._id}
            type={f.type}
            passiveData={f.passiveData}
            interactiveData={f.interactiveData}
            key={i}
            isMediaActive={isCurrent}
            isCurrent={isCurrent}
          />
        ))}
        {showHidden && hiddenFields.length !== 0 && <Hr />}
        {showHidden &&
          hiddenFields.map((f, i) => (
            <Field
              _id={f._id}
              type={f.type}
              passiveData={f.passiveData}
              interactiveData={f.interactiveData}
              key={i}
              isMediaActive={isCurrent && isMediaActive}
              isCurrent={isCurrent}
            />
          ))}
      </Card>
    </CardContainer>
  );
};
