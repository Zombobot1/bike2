import './field.scss';
import React, { useEffect, useState } from 'react';
import { useIsSM, useMount } from '../../../../../utils/hooks-utils';
import { RadioField } from './radio-field';
import { FieldDTO } from '../../types';
import { UInput } from '../../../../uform/ufields/uinput';
import { useInteractiveSubmit } from '../../hooks';
import { IconButton, styled, Stack } from '@material-ui/core';
import PlayCircleRoundedIcon from '@material-ui/icons/PlayCircleRounded';
import PauseCircleRoundedIcon from '@material-ui/icons/PauseCircleRounded';

export interface PlayerP {
  src: string;
  autoplay?: boolean;
}

const Player = ({ src, autoplay = false }: PlayerP) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    setIsPlaying(true);
    audio?.play();
  };

  const pause = () => {
    setIsPlaying(false);
    audio?.pause();
  };

  useEffect(() => {
    if (autoplay) play();
  }, [audio, autoplay]);

  useMount(() => {
    const audioFile = new Audio(src);
    setAudio(audioFile);
    audioFile.load();

    audioFile.addEventListener('ended', () => setIsPlaying(false));
  });
  const sx = { width: 50, height: 50 };
  return (
    <Stack alignItems="center">
      {!isPlaying && (
        <IconButton color="primary" onClick={play}>
          <PlayCircleRoundedIcon sx={sx} />
        </IconButton>
      )}
      {isPlaying && (
        <IconButton color="primary" onClick={pause}>
          <PauseCircleRoundedIcon sx={sx} />
        </IconButton>
      )}
    </Stack>
  );
};

export interface FieldP extends Omit<FieldDTO, 'status'> {
  isMediaActive: boolean;
  isCurrent: boolean; // if we render all interactive fields it would be impossible to submit one card
}

const Pre = styled('pre')({
  overflowY: 'hidden',
  overflowX: 'hidden',
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
  marginBottom: 0,
  lineHeight: 1.12,
  flex: '0 0 auto',
});

const ImageField = styled('div')({
  minHeight: '40%',
  borderRadius: 5,
  backgroundPosition: '50% 50%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
});

export const Field = ({ _id, passiveData, interactiveData, type, isMediaActive, isCurrent }: FieldP) => {
  const { interactiveSubmit } = useInteractiveSubmit();
  const isSM = useIsSM();
  if (passiveData) {
    return (
      <>
        {type === 'PRE' && (
          <Pre sx={{ fontSize: isSM ? 32 : 26, textAlign: passiveData.length < 90 ? 'center' : 'left' }}>
            {passiveData}
          </Pre>
        )}
        {type === 'IMG' && <ImageField sx={{ backgroundImage: `url("${passiveData}")` }} />}
        {type === 'AUDIO' && <Player src={passiveData} autoplay={isMediaActive} />}
      </>
    );
  } else if (interactiveData && isCurrent) {
    return (
      <>
        {type === 'RADIO' && <RadioField _id={_id} {...interactiveData} onAnswer={interactiveSubmit} />}
        {type === 'INPUT' && <UInput _id={_id} {...interactiveData} onAnswer={interactiveSubmit} />}
      </>
    );
  }
  return null;
};
