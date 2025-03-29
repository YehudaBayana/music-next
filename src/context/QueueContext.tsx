import { createContext, useContext, useState, ReactNode } from 'react';

type QueueContextType = {
  isOpen: boolean;
  openQueue: () => void;
  closeQueue: () => void;
};

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openQueue = () => setIsOpen(true);
  const closeQueue = () => setIsOpen(false);

  return (
    <QueueContext.Provider value={{ isOpen, openQueue, closeQueue }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a PopupProvider');
  }
  return context;
};
