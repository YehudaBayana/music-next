import React from 'react';
import Toast, { ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-in-right"
        >
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
