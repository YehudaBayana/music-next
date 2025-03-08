'use client';
import { IoShuffle, IoRepeat } from 'react-icons/io5';
import { WithContextMenu } from '@/components/contextMenu/WithContextMenu';

export default function TestC() {
  const fileOptions = [
    {
      label: 'Open',
      action: () => console.log('Opening file...'),
      icon: <IoShuffle className='w-4 h-4' />,
    },
    {
      label: 'Delete',
      action: () => console.log('Deleting file...'),
      icon: <IoRepeat className='w-4 h-4' />,
      disabled: true,
    },
  ];

  //   const folderOptions = [
  //     {
  //       label: 'New File',
  //       action: () => console.log('Creating new file...'),
  //     },
  //     {
  //       label: 'Rename',
  //       action: () => console.log('Renaming folder...'),
  //     },
  //   ];

  return (
    <div className='p-8 space-y-4'>
      {/* Right-click trigger */}
      <WithContextMenu
        options={fileOptions}
        className='p-4 border rounded bg-gray-50'
      >
        <div>Right-click me (default behavior)</div>
      </WithContextMenu>

      {/* Click trigger button */}
      <WithContextMenu
        options={fileOptions}
        triggerType='click'
        className='inline-block' // Important for button positioning
      >
        <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
          Click me to open menu
        </button>
      </WithContextMenu>

      {/* Click trigger card */}
      <WithContextMenu
        options={fileOptions}
        className='p-4 border rounded bg-white cursor-pointer hover:bg-gray-50'
      >
        <div>
          <WithContextMenu
            options={fileOptions}
            triggerType='click'
            className='p-4 border rounded bg-white cursor-pointer hover:bg-gray-50'
          >
            <h3 className='font-bold'>Clickable Card</h3>
          </WithContextMenu>
          <p className='text-gray-600'>Click anywhere on this card</p>
        </div>
      </WithContextMenu>
    </div>
  );
}
