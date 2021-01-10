import './breadcrumb.scss';
import { useRouter } from '../../utils/hooks/use-router';
import { _SANDBOX, ICONST } from '../../pages';
import React from 'react';

const breadcrumbFromPath = (path: string) => {
  const parts = path.split('/');
  if (parts[1] === '_') return 'Sandbox';
  if (parts.length < 3) return '';
  const root = parts[2];
  return root[0].toUpperCase() + root.slice(1);
};

const Breadcrumb = () => {
  const router = useRouter();
  const breadcrumb = breadcrumbFromPath(router.pathname);
  const Icon = ICONST[router.pathname];
  return (
    <div className="d-flex breadcrumb-container">
      {Icon && <Icon />}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">{breadcrumb}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
