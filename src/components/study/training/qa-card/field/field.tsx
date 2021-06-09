import './field.scss';
import React, { useEffect, useState } from 'react';
import { cn } from '../../../../../utils/utils';
import { ReactComponent as PlayI } from '../../../../icons/bi-play-fill.svg';
import { ReactComponent as PauseI } from '../../../../icons/bi-pause-fill.svg';
import { useMount } from '../../../../../utils/hooks-utils';
import { RadioField } from './radio-field';
import { FieldDTO } from '../../types';

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

export interface FieldP extends Omit<FieldDTO, 'side'> {
  isMediaActive: boolean;
  isCurrent: boolean;
}

export const Field = ({ passiveData, interactiveData, type, isMediaActive, isCurrent }: FieldP) => {
  useMount(() => {
    if (type === 'IMG' && passiveData) preloadImage(passiveData); // for chrome mobile
  });

  if (passiveData) {
    const alignCenter = cn({ 'text-center': passiveData.split(' ').length < 4 });
    return (
      <>
        {type === 'PRE' && <pre className={'qa-card__pre ' + alignCenter}>{passiveData}</pre>}
        {type === 'IMG' && <div className="qa-card__image" style={{ backgroundImage: `url("${passiveData}")` }} />}
        {type === 'AUDIO' && <Player className="qa-card__audio" src={passiveData} autoplay={isMediaActive} />}
      </>
    );
  } else if (interactiveData) {
    return <>{type === 'RADIO' && <RadioField {...interactiveData} isCurrent={isCurrent} />}</>;
  }
  return null;
};
