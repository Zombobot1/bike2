import { ReactComponent as OverdueI } from './attention-icon.svg';
import React from 'react';
import { OverdueType } from '../cards/notification/notification';
import { cne } from '../../utils/utils';

export interface OverdueP {
  type: OverdueType;
}
export const Overdue = ({ type }: OverdueP) => <OverdueI className={cne({ overdue: type }, OverdueType)} />;
