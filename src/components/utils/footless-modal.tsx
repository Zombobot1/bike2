import React, { FC } from 'react';

export interface FootlessModalP {
  id: string;
  title: string;
}

const ModalClosingFooter = () => (
  <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
    Close
  </button>
);

const ModalTitle = ({ id, title }: FootlessModalP) => (
  <p className="modal-title" id={`${id}Label`}>
    {title}
  </p>
);

const ModalHeader = (id: string, title: string) => () => (
  <div className="modal-header">
    <ModalTitle id={id} title={title} />
    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
  </div>
);

const ModalTemplate = (id: string, Body: FC, Header: FC | null = null, Footer: FC | null = null) => (
  <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
    <div className="modal-dialog modal-dialog-scrollable">
      <div className="modal-content">
        {Header && <Header />}
        <div className="modal-body">
          <Body />
        </div>
        {Footer && (
          <div className="modal-footer">
            <Footer />
          </div>
        )}
      </div>
    </div>
  </div>
);

export const FootlessModal = ({ id, title }: FootlessModalP) => (Body: FC) => () =>
  ModalTemplate(id, Body, ModalHeader(id, title));

export const HeadlessModal = (id: string, Body: FC) => () => ModalTemplate(id, Body, null, ModalClosingFooter);

export const Modal = (id: string, title: string, Body: FC) => () =>
  ModalTemplate(id, Body, ModalHeader(id, title), ModalClosingFooter);
