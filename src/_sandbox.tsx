import { TextField } from '@material-ui/core';
import React from 'react';
import 'swiper/swiper.scss';

export const Sandbox = () => {
  const sx = {
    '& .MuiInputBase-input.Mui-disabled': {
      color: 'red',
      '-webkit-text-fill-color': 'unset',
    },
  };
  return (
    <>
      <main className="content-area">
        <TextField sx={sx} disabled value="text" variant="standard" placeholder="Your answer" />
      </main>
    </>
  );
};
