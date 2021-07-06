import './breadcrumb.scss';
import { useRouter } from '../../utils/hooks/use-router';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { safeSplit } from '../../../utils/algorithms';
import { useUserPosition } from './user-position-provider';
import { toAppPage } from '../utils';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { IconButton, Stack, Link, LinkProps, Breadcrumbs, Typography, useTheme } from '@material-ui/core';
import { useIsSM } from '../../../utils/hooks-utils';

export interface LinkName {
  name: string;
}

interface LinkRouter extends LinkProps {
  to: string;
  replace?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LinkRouter = (props: LinkRouter) => <Link {...props} component={RouterLink as any} />;

const pageName = (path: string) => {
  const parts = safeSplit(path, '/');
  if (parts[0] === '_') return 'Sandbox';
  if (parts.length < 2 || !parts[1]) return '';
  const root = parts[1];
  return root[0].toUpperCase() + root.slice(1);
};

const Breadcrumb = () => {
  const isSM = useIsSM();
  const theme = useTheme();

  const router = useRouter();
  const appPage = pageName(router.pathname);
  const { path } = useUserPosition();

  const hasPath = safeSplit(router.pathname, '/').length > 2 && path.length;

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={isSM ? undefined : { borderBottom: `solid 1px ${theme.palette.grey['300']}` }}
    >
      <IconButton color="primary">
        <MenuRoundedIcon />
      </IconButton>
      <Breadcrumbs aria-label="breadcrumb">
        {!hasPath && <Typography>{appPage}</Typography>}
        {hasPath && (
          <LinkRouter underline="hover" color="inherit" to={toAppPage(appPage)}>
            {appPage}
          </LinkRouter>
        )}
        {hasPath && <Typography>{path[0].name}</Typography>}
      </Breadcrumbs>
    </Stack>
  );
};

export default Breadcrumb;
