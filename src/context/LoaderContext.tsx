import React, { createContext, useState } from 'react';
import GlobalLoader from '../components/Loader/GlobalLoader';

export const LoaderContext = createContext({
  show: () => {},
  hide: () => {},
});

export const LoaderProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        show: () => setVisible(true),
        hide: () => setVisible(false),
      }}
    >
      {children}
      <GlobalLoader visible={visible} />
    </LoaderContext.Provider>
  );
};
