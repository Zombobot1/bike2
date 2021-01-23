import './breadcrumb.scss';
import { useRouter } from '../../utils/hooks/use-router';
import { iconForAppPage, ICONST, STUDY, toAppPage } from '../../pages';
import React, { useEffect } from 'react';
import { ReactComponent as Burger } from './burger.svg';
import { useUserPosition } from './useUserPosition';
import { usePagesInfoDispatch } from '../../context/user-position-provider';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/utils';

export interface BreadcrumbP {
  toggleNavbarVisibility: () => void;
}
// export interface NLinkP {
//   id: string;
//   name: string;
//   to: string;
// }
// const NLink = ({ id, name, to }: NLinkP) => {
//   const onMoveToPage = () => addPage(id, name);
//   return <Link to={to}>{name}</Link>
// };
export interface LinkP {
  name: string;
}

export interface IdLinkP extends LinkP {
  id: string;
}

const AppPageLink = ({ name }: LinkP) => {
  const dispatch = usePagesInfoDispatch();
  const clearPages = () => dispatch({ type: 'CLEAR' });
  return (
    <Link to={toAppPage(name)} onClick={clearPages}>
      {name}
    </Link>
  );
};

const TrainingLink = ({ id, name }: IdLinkP) => <Link to={`${STUDY}/${id}`}>{name}</Link>;

const Breadcrumb = ({ toggleNavbarVisibility }: BreadcrumbP) => {
  const [appPage, ...contentPages] = useUserPosition();
  const Icon = iconForAppPage(appPage.name);
  useEffect(() => console.log(!contentPages.length), []);
  return (
    <div className="d-flex breadcrumb-container">
      <Burger className="transparent-button burger-icon" onClick={toggleNavbarVisibility} />
      {Icon && <Icon />}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <AppPageLink name={appPage.name} />
          </li>
          {contentPages.map((e, i) => (
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
