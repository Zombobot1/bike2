import React from 'react';

const Alert = (type: string, text: string) => (isVisible: boolean) => (
  <div className={`alert alert-${type} text-center ${!isVisible ? 'invisible' : ''}`} role="alert">
    {text}
  </div>
);

export default Alert;
