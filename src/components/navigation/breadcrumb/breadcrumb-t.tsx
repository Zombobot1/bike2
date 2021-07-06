import Breadcrumb from './breadcrumb';
import { Box } from '@material-ui/core';
import { COLORS } from '../../../theme';
import { MemoryRouter, useHistory } from 'react-router-dom';
import React from 'react';
import { Btn } from '../../utils/controls';
import { useUserPosition } from './user-position-provider';
import { useMount } from '../../../utils/hooks-utils';

function BreadcrumbT_() {
  const { setPath } = useUserPosition();
  useMount(() => setPath([{ name: 'Deck name' }]));
  const history = useHistory();
  return (
    <Box sx={{ maxWidth: 400, backgroundColor: COLORS.light, padding: 2 }}>
      <Breadcrumb />
      <Btn
        text="Go to deck"
        onClick={() => {
          history.push('/app/study/Deck name');
          setPath([{ name: 'Deck name' }]);
        }}
      />
    </Box>
  );
}

export const BreadcrumbT = () => (
  <MemoryRouter initialEntries={['/app/study/Deck name']}>
    <BreadcrumbT_ />
  </MemoryRouter>
);

export const SBreadcrumb = {
  goToDeck: () => <BreadcrumbT />,
  goToStudy: () => <BreadcrumbT />,
};
