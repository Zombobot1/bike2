import { Meta, Story } from '@storybook/react';
import { hidesWithoutWasteInDOMA, ModalT, ModalTP, survivesRerendersA } from '../../components/utils/modal-stories';
import React from 'react';

export default {
  title: 'Utils/Modals',
  component: ModalT,
} as Meta;

const Template: Story<ModalTP> = (args) => <ModalT {...args} />;

export const HidesWithoutWasteInDOM = Template.bind({});
HidesWithoutWasteInDOM.args = { ...hidesWithoutWasteInDOMA };

export const SurvivesRerenders = Template.bind({});
SurvivesRerenders.args = { ...survivesRerendersA };
