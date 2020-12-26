import React, { FC } from 'react';

type FootlessModalP = {
  id: string;
  title: string;
};

export const FootlessModal = ({ id, title }: FootlessModalP) => (Body: FC) => () => {
  return (
    <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <p className="modal-title" id={`${id}Label`}>
              {title}
            </p>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <Body />
          </div>
        </div>
      </div>
    </div>
  );
};
