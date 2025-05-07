import React, { createContext, useState, useEffect, useCallback } from 'react';
import ToastContainer from '../components/toast/ToastContainer';
import { ToastProps, ToastType } from '../components/toast/Toast';

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => string;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {
    return '';
  },
  hideToast: () => {},
});

// Simple ID generator if uuid is not available
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Remove toast after it expires
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1));
      }, 5000); // Auto dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = generateId();

    const newToast: ToastProps = {
      id,
      message,
      type,
      onClose: hideToast,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};
