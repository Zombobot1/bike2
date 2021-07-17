import { useRouter } from '../../utils/hooks/use-router';
import { Link as RouterLink } from 'react-router-dom';
import { safeSplit } from '../../../utils/algorithms';
import { useUserPosition } from './user-position-provider';
import { toAppPage } from '../utils';
import { Link, LinkProps, Breadcrumbs, Typography, useTheme, IconButton, Stack } from '@material-ui/core';
import { useIsSM } from '../../../utils/hooks-utils';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

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

export const Breadcrumb = () => {
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
      {!isSM && (
        <IconButton color="primary">
          <MenuRoundedIcon />
        </IconButton>
      )}
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
