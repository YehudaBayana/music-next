import React from 'react';
import { IoMdClose } from 'react-icons/io';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  console.log('Toast rendered', { id, message, type });

  return (
    <div
      className={`${getBackgroundColor()} text-white p-4 rounded-md shadow-lg max-w-sm w-full flex justify-between items-center transition-all duration-300 ease-in-out mb-2`}
      role='alert'
    >
      <span className='text-sm'>{message}</span>
      <button
        onClick={() => onClose(id)}
        className='text-white hover:text-gray-200 transition-colors'
        aria-label='Close'
      >
        <IoMdClose size={18} />
      </button>
    </div>
  );
};

export default Toast;
