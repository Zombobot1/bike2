import './breadcrumb.scss';
import { useRouter } from '../../utils/hooks/use-router';
import { iconForAppPage, STUDY, toAppPage } from '../../pages';
import React, { FC } from 'react';
import { ReactComponent as Burger } from './burger.svg';
import { Link } from 'react-router-dom';
import { safeSplit } from '../../../utils/algorithms';
import { useUserPosition } from '../../context/user-position-provider';

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
  const { clearPath } = useUserPosition();
  return (
    <Link to={toAppPage(name)} onClick={clearPath}>
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
  const { clearPath } = useUserPosition();
  return (
    <Link className={className} to={to} onClick={clearPath}>
      <Icon />
    </Link>
  );
};

const TrainingLink = ({ id, name }: IdLinkP) => <Link to={`${STUDY}/${id}`}>{name}</Link>;

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
  const { path } = useUserPosition();
  return (
    <div className="d-flex breadcrumb-container">
      <Burger className="transparent-button bi-burger" onClick={toggleNavbarVisibility} />
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
