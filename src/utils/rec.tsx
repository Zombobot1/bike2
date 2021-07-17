import { ReactNode } from 'react';
import { getIds } from './utils';

const id = getIds();

type RecP = {
  width?: number;
  height?: number;
  color?: string;
  isHidden?: boolean;
  _id?: string;
  className?: string;
  children?: ReactNode;
};
export const Rec = ({
  height = 100,
  width = 200,
  color = 'red',
  isHidden = false,
  _id = id(),
  children,
  className = '',
}: RecP) => {
  return (
    <div
      className={'rec ' + className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        display: isHidden ? 'none' : 'block',
      }}
    >
      {children}
    </div>
  );
};