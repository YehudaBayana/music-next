// components/ContextMenu.tsx
'use client';

import { ContextMenuProps } from '@/components/contextMenu/types';
import { useEffect } from 'react';

const ContextMenu = ({ options, position, onClose }: ContextMenuProps) => {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div
      role='menu'
      aria-orientation='vertical'
      className='absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 min-w-[200px]'
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      {options.map((option, index) => (
        <button
          role='menuitem'
          tabIndex={0}
          key={index}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            option.action();
            onClose();
          }}
          disabled={option.disabled}
          className='w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {option.icon && <span>{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
