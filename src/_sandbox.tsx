import React from 'react';
import 'swiper/swiper.scss';
import { IconButton, Typography } from '@material-ui/core';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import AutorenewOutlinedIcon from '@material-ui/icons/AutorenewOutlined';
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined';

export const Sandbox = () => {
  return (
    <>
      <IconButton color="primary">
        <MenuRoundedIcon />
      </IconButton>
      <Typography fontSize="small">
        <AutorenewOutlinedIcon sx={{ width: 15, height: 15 }} />
        {'234'}
        <RemoveRedEyeOutlinedIcon sx={{ width: 15, height: 15 }} />
        {'234'}
      </Typography>
    </>
  );
};
