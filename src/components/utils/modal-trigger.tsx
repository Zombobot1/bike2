import React from 'react';

export interface ModalTriggerP {
  className: string;
  modalId: string;
  text: string;
}

export const ModalTrigger = ({ className, modalId, text }: ModalTriggerP) => (
  <button className={className} data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
    {text}
  </button>
);
