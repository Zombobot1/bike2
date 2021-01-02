import { cne } from '../../utils/utils';
import { ReactComponent as OverdueI } from './attention-icon.svg';
import React from 'react';
import { OverdueType } from '../notifications/notification/notification';

type OverdueP = {
  type: OverdueType;
};
export const Overdue = ({ type }: OverdueP) => <OverdueI className={cne({ overdue: type }, OverdueType)} />;
