import './breadcrumb.scss';
import { useRouter } from '../../utils/hooks/use-router';
import { iconForAppPage, STUDY, toAppPage } from '../../pages';
import React, { FC } from 'react';
import { ReactComponent as Burger } from './burger.svg';
import { usePagesInfoDispatch, usePagesInfoState } from '../../context/user-position-provider';
import { Link } from 'react-router-dom';

export interface BreadcrumbP {
  toggleNavbarVisibility: () => void;
}

export interface LinkP {
  name: string;
}

export interface IdLinkP extends LinkP {
  id: string;
}

export const AppPageTextLink = ({ name }: LinkP) => {
  const dispatch = usePagesInfoDispatch();
  const clearPages = () => dispatch({ type: 'CLEAR' });
  return (
    <Link to={toAppPage(name)} onClick={clearPages}>
      {name}
    </Link>
  );
};

export interface AppPageIconLinkP {
  to: string;
  Icon: FC;
  className: string;
}

export const AppPageIconLink = ({ to, Icon, className }: AppPageIconLinkP) => {
  const dispatch = usePagesInfoDispatch();
  const clearPages = () => dispatch({ type: 'CLEAR' });
  return (
    <Link className={className} to={to} onClick={clearPages}>
      <Icon />
    </Link>
  );
};

const TrainingLink = ({ id, name }: IdLinkP) => <Link to={`${STUDY}/${id}`}>{name}</Link>;

const safeSplit = (str: string, sep: string) => {
  const parts = str.split(sep);
  return parts.filter((e) => e);
};

const pageName = (path: string) => {
  const parts = safeSplit(path, '/');
  if (parts[0] === '_') return 'Sandbox';
  if (parts.length < 2 || !parts[1]) return '';
  const root = parts[1];
  return root[0].toUpperCase() + root.slice(1);
};

const Breadcrumb = ({ toggleNavbarVisibility }: BreadcrumbP) => {
  const router = useRouter();
  const appPage = pageName(router.pathname);
  const Icon = iconForAppPage(appPage);
  const { path } = usePagesInfoState();
  return (
    <div className="d-flex breadcrumb-container">
      <Burger className="transparent-button burger-icon" onClick={toggleNavbarVisibility} />
      {Icon && <Icon />}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <AppPageTextLink name={appPage} />
          </li>
          {path.map((e, i) => (
            <li className="breadcrumb-item" key={i}>
              <TrainingLink {...e} />
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
