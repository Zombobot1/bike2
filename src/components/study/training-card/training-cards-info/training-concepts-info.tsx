import './training-cards-info.scss';
import React from 'react';
import { fancyNumber } from '../../../../utils/formatting';
import AutorenewOutlinedIcon from '@material-ui/icons/AutorenewOutlined';
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined';
import { Typography } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon/SvgIcon';

export interface TrainingConceptsInfoP {
  toRepeat: number;
  toLearn: number;
}
type Info = {
  Icon: OverridableComponent<SvgIconTypeMap> & { muiName: string };
  num: number;
  margin?: string;
};

const Info = ({ Icon, num, margin = '1px' }: Info) => (
  <>
    <Icon sx={{ width: 15, height: 15, transform: 'translateY(-1px)', marginRight: margin }} />
    {fancyNumber(num)}
  </>
);

export const TrainingConceptsInfo = ({ toRepeat, toLearn }: TrainingConceptsInfoP) => {
  // Stack at the root leads to an anomaly: Breadcrumb pushes icons down
  return (
    <Typography fontSize="small">
      {Boolean(toRepeat) && <Info Icon={AutorenewOutlinedIcon} num={toRepeat} />}{' '}
      {Boolean(toLearn) && <Info Icon={RemoveRedEyeOutlinedIcon} num={toLearn} margin={'2px'} />}
    </Typography>
  );
};
