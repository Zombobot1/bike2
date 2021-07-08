import './regular-trainings.scss';
import React from 'react';
import { FetchData } from '../../utils/fetched-data';
import { useTrainings } from '../hooks';
import { TrainingDeck } from '../training-deck/training-deck';
import { styled } from '@material-ui/core';

import Masonry from 'react-masonry-css';
import { useIsSM } from '../../../utils/hooks-utils';

const TrainingsMasonry = styled(Masonry)({
  display: 'flex',
  marginLeft: '-20px' /* gutter size offset */,
  // width: 'auto',

  '.my-masonry-grid_column': {
    paddingLeft: '20px' /* gutter size */,
    backgroundClip: 'padding-box',
  },
});

const Trainings_ = () => {
  const { data } = useTrainings();

  const isSM = useIsSM();
  const columns = isSM ? 4 : 1;

  return (
    // <>
    //   {data?.map((e, j) => (
    //     <TrainingDeck {...e} key={j} />
    //   ))}
    // </>
    <TrainingsMasonry
      breakpointCols={columns}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
      sx={{ width: isSM ? 4 * 320 + 20 * 3 : 'auto' }}
    >
      {data?.map((e, j) => (
        <TrainingDeck {...e} key={j} />
      ))}
      {/*<div className="w-100 trainings-footer" />*/}
    </TrainingsMasonry>
  );
};

export function Trainings() {
  return (
    <div>
      <h2 className="page-header">Regular trainings</h2>
      <FetchData>
        <Trainings_ />
      </FetchData>
    </div>
  );
}
