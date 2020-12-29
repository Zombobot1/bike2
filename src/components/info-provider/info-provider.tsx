import React, { FC, useContext } from 'react';
import appData from '../../content';

const InfoProviderContext = React.createContext(appData);

const useInfo = () => useContext(InfoProviderContext);

const InfoProvider: FC = ({ children }) => {
  return <InfoProviderContext.Provider value={appData}>{children}</InfoProviderContext.Provider>;
};

export default InfoProvider;
export { useInfo };
