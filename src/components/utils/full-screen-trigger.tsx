import { SM } from '../../config';
import React, { useEffect, useState } from 'react';
import { ReactComponent as FullScreenI } from '../icons/bi-arrows-fullscreen.svg';
import { ReactComponent as ExitFullScreenI } from '../icons/bi-fullscreen-exit.svg';
import * as screenfull from 'screenfull';
import { Screenfull } from 'screenfull';
import { useMedia } from './hooks/use-media';

const fs = () => screenfull as Screenfull;

export const FullScreenTrigger = () => {
  if (!screenfull.isEnabled) return null;

  const isMobile = useMedia([SM], [true], false);
  const [full, setFull] = useState(fs().isFullscreen);

  const setFullScreen = () => setFull(fs().isFullscreen);
  useEffect(() => {
    fs().onchange(setFullScreen);
    return () => fs().off('change', setFullScreen);
  }, []);

  const toggle = () => fs().toggle();
  return (
    <div className="transparent-button fs-trigger">
      {!full && isMobile && <FullScreenI onClick={toggle} />}
      {full && <ExitFullScreenI onClick={toggle} />}
    </div>
  );
};
