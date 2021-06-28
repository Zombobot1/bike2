import React, { FC } from 'react';

type AlertP = { isVisible: boolean };
export type AlertFC = FC<AlertP>;
export const Alert =
  (type: string, Base: FC): AlertFC =>
  ({ isVisible }: AlertP) =>
    (
      <div className={`alert alert-${type} text-center ${!isVisible ? 'invisible' : ''}`} role="alert">
        <Base />
      </div>
    );

export const AlertWithText =
  (type: string, text: string): AlertFC =>
  ({ isVisible }: AlertP) =>
    (
      <div className={`alert alert-${type} text-center ${!isVisible ? 'invisible' : ''}`} role="alert">
        {text}
      </div>
    );
