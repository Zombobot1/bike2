import './field.scss';
import React, { useEffect, useState } from 'react';
import { FieldTBase } from '../../types';
import { cn } from '../../../../../utils/utils';
import { ReactComponent as PlayI } from '../../../../icons/bi-play-fill.svg';
import { ReactComponent as PauseI } from '../../../../icons/bi-pause-fill.svg';
import { useMount } from '../../../../../utils/hooks-utils';
import { RadioField } from './radio-field';

export interface PlayerP {
  className?: string;
  src: string;
  autoplay?: boolean;
}

const Player = ({ className, src, autoplay = false }: PlayerP) => {
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

  return (
    <div className={'d-flex justify-content-center ' + className}>
      <button className="btn btn-primary play-btn" onClick={isPlaying ? pause : play}>
        {!isPlaying && <PlayI />}
        {isPlaying && <PauseI />}
      </button>
    </div>
  );
};

const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

export interface FieldP extends FieldTBase {
  isMediaActive: boolean;
  isCurrent: boolean;
}

export const Field = ({ data, type, isMediaActive, isCurrent }: FieldP) => {
  if (!data) return null;

  useMount(() => {
    if (type === 'IMG') preloadImage(data); // for chrome mobile
  });

  const alignCenter = cn({ 'text-center': data.split(' ').length < 4 });
  return (
    <>
      {type === 'PRE' && <pre className={'qa-card__pre ' + alignCenter}>{data}</pre>}
      {type === 'IMG' && <div className="qa-card__image" style={{ backgroundImage: `url("${data}")` }} />}
      {type === 'AUDIO' && <Player className="qa-card__audio" src={data} autoplay={isMediaActive} />}
      {type === 'RADIO' && <RadioField data={data} isCurrent={isCurrent} />}
    </>
  );
};
