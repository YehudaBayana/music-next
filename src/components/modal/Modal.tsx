// components/modal/Modal.tsx
'use client';

import { useEffect } from 'react';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
  height?: string;
};

const Modal = ({
  children,
  onClose,
  width = '500px',
  height = 'auto',
}: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div
        className='bg-white dark:bg-gray-800 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto'
        style={{ width, height }}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
        >
          ✕
        </button>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
