import React, { FC } from 'react';
import { fn, Fn } from '../../utils/types';
import { useEventListeners } from './hooks/use-event-listener';

export interface FootlessModalP {
  id: string;
  title: string;
}

const ClosingFooter = () => (
  <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
    Close
  </button>
);

const AcceptanceFooter = (onAccept: Fn) => () =>
  (
    <>
      <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">
        Cancel
      </button>
      <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onAccept}>
        Delete
      </button>
    </>
  );

const ModalTitle = ({ id, title }: FootlessModalP) => (
  <p className="modal-title" id={`${id}Label`}>
    {title}
  </p>
);

const ModalHeader = (id: string, title: string) => () =>
  (
    <div className="modal-header">
      <ModalTitle id={id} title={title} />
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
    </div>
  );

const ModalTemplate = (
  id: string,
  Body: FC,
  Header: FC | null = null,
  Footer: FC | null = null,
  onShow = fn,
  onClose = fn,
) => {
  const ref = useEventListeners([
    { event: 'hide.bs.modal', handler: onClose },
    { event: 'show.bs.modal', handler: onShow },
  ]);

  return (
    <div className="modal fade" ref={ref} id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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
};

export const FootlessModal =
  ({ id, title }: FootlessModalP) =>
  (Body: FC) =>
  () =>
    ModalTemplate(id, Body, ModalHeader(id, title));

export const HeadlessModal = (id: string, Body: FC) => () => ModalTemplate(id, Body, null, ClosingFooter);

export const Modal = (id: string, title: string, Body: FC) => () =>
  ModalTemplate(id, Body, ModalHeader(id, title), ClosingFooter);

export const AcceptanceModal = (id: string, onAccept: Fn, onShow: Fn, onClose: Fn) => () =>
  ModalTemplate(id, () => <p className="fs-5">Are you sure?</p>, null, AcceptanceFooter(onAccept), onShow, onClose);

export interface ModalTriggerP {
  className?: string;
  modalId: string;
  text: string;
}

export const ModalTrigger = ({ className = 'btn btn-primary', modalId, text }: ModalTriggerP) => (
  <button className={className} data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
    {text}
  </button>
);
