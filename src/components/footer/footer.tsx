import './footer.scss';
import React from 'react';

type FooterP = {
  className: string;
};

const Footer = ({ className }: FooterP) => (
  <div className={'d-flex justify-content-between ' + className}>
    <p className="me-auto">{`Copyright © ${new Date().getFullYear()} Uni`}</p>
    <span className={'d-flex justify-content-between refs'}>
      <a href="#">About</a>
      <a href="#">Presentation</a>
      <a href="#">Contact</a>
    </span>
  </div>
);

export default Footer;
