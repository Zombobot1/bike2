import { Btn } from './controls';

export const ControlsT = () => {
  return (
    <div className="d-flex flex-column gap-1">
      <div>
        <Btn text="Large button" />
      </div>
    </div>
  );
};

export const SControls = {
  controls: () => <ControlsT />,
};
