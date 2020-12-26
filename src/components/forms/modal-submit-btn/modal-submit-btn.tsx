import React from 'react';

type ModalSubmitBtnP = {
  canDismiss: boolean;
};

const ModalSubmitBtn = ({ canDismiss }: ModalSubmitBtnP) => (
  <div className={'d-flex justify-content-center'} data-bs-dismiss={canDismiss ? 'modal' : ''}>
    <button type="submit" className="btn btn-primary">
      Send
    </button>
  </div>
);

export default ModalSubmitBtn;
