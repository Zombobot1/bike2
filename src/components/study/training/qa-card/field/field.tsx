import './field.scss';
import React, { useEffect, useState } from 'react';
import { FieldP } from '../../types';
import { cn } from '../../../../../utils/utils';
import { ReactComponent as PlayI } from '../../../../icons/bi-play-circle-fill.svg';
import { ReactComponent as PauseI } from '../../../../icons/bi-pause-circle-fill.svg';

export interface PlayerP {
  className?: string;
  src: string;
}

const Player = ({ className, src }: PlayerP) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    const audioFile = new Audio(src);
    setAudio(audioFile);
    audioFile.load();
    audioFile.addEventListener('ended', () => setIsPlaying(false));
  }, []);

  const play = () => {
    setIsPlaying(true);
    audio?.play();
  };
  const pause = () => {
    setIsPlaying(false);
    audio?.pause();
  };

  return (
    <div className={'d-flex justify-content-center ' + className}>
      {!isPlaying && <PlayI onClick={play} />}
      {isPlaying && <PauseI onClick={pause} />}
    </div>
  );
};

export const Field = ({ data, type }: FieldP) => {
  if (!data) return null;

  const alignCenter = cn({ 'text-center': data.split(' ').length < 4 });
  return (
    <>
      {type === 'PRE' && <pre className={'qa-card__pre ' + alignCenter}>{data}</pre>}
      {type === 'IMG' && <div className="qa-card__image" style={{ backgroundImage: `url("${data}")` }} />}
      {type === 'AUDIO' && <Player className="qa-card__audio" src={data} />}
    </>
  );
};
