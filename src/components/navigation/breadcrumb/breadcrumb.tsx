import './breadcrumb.scss';
import { useRouter } from '../../utils/hooks/use-router';
import { ICONST } from '../../pages';
import React from 'react';

const breadcrumbFromPath = (path: string) => {
  const parts = path.split('/');
  const root = parts[2];
  return root[0].toUpperCase() + root.slice(1);
};

const Breadcrumb = () => {
  const router = useRouter();
  const Icon = ICONST[router.pathname];
  return (
    <div className="d-flex breadcrumb-container">
      <Icon />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">{breadcrumbFromPath(router.pathname)}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
