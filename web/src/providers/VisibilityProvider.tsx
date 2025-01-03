import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const VisibilityCtx = createContext<{
  setVisible: (visible: boolean) => void;
  visible: boolean;
}>({
  setVisible: () => {},
  visible: false,
});

export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  useNuiEvent<boolean>('setVisible', (data) => {
    setVisible(data);
    if (data) {
      const root = document.getElementById('root');
      if (root) {
        root.classList.add('visible');
      }
    } else {
      const root = document.getElementById('root');
      if (root) {
        root.classList.remove('visible');
      }
    }
  });

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Escape"].includes(e.code)) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        setVisible(false);
        const root = document.getElementById('root');
        if (root) {
          root.classList.remove('visible');
        }
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  return (
    <VisibilityCtx.Provider value={{ visible, setVisible }}>
      {children}
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityCtx);
