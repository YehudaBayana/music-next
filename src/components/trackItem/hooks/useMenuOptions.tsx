import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useModal } from '@/context/ModalContext';

export const useMenuOptions = ({ onDelete }: { onDelete: () => void }) => {
  const { openModal, closeModal } = useModal();
  //   const onDelete = () => {
  //     console.log('deleted');
  //     closeModal();
  //   };
  const menuOptions = [
    {
      label: 'add to playlist',
      action: () => console.log('add'),
      // icon: <MdOutlinePlaylistAdd />,
    },
    {
      label: 'delete from this playlist',
      action: () =>
        openModal(
          <ConfirmModal
            title='Delete Item'
            message='Are you sure you want to delete this item?'
            onConfirm={onDelete}
            onCancel={() => closeModal()}
          />
        ),
      // icon: <MdOutlinePlaylistAdd />,
    },
    {
      label: 'Add To Queue',
      action: () => console.log('Deleting file...'),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      disabled: true,
    },
    {
      label: 'Go To Album',
      action: () => console.log('Deleting file...'),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      disabled: true,
    },
    {
      label: 'Go To Artist',
      action: () => console.log('Deleting file...'),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      disabled: true,
    },
    {
      label: 'Save to favorites',
      action: () => console.log('Deleting file...'),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      disabled: true,
    },
  ];
  return menuOptions;
};
