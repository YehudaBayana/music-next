import { MdOutlinePlaylistAdd, MdOutlineAddToQueue } from 'react-icons/md';

export const menuOptions = [
  {
    label: 'add to playlist',
    action: () => console.log('add to playlist'),
    icon: <MdOutlinePlaylistAdd />,
  },
  {
    label: 'Add To Queue',
    action: () => console.log('Deleting file...'),
    icon: <MdOutlineAddToQueue className='w-4 h-4' />,
    disabled: true,
  },
  {
    label: 'Go To Album',
    action: () => console.log('Deleting file...'),
    icon: <MdOutlineAddToQueue className='w-4 h-4' />,
    disabled: true,
  },
  {
    label: 'Go To Artist',
    action: () => console.log('Deleting file...'),
    icon: <MdOutlineAddToQueue className='w-4 h-4' />,
    disabled: true,
  },
  {
    label: 'Save to favorites',
    action: () => console.log('Deleting file...'),
    icon: <MdOutlineAddToQueue className='w-4 h-4' />,
    disabled: true,
  },
];
