type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <div className='space-y-4'>
    <h3 className='text-lg font-semibold'>{title}</h3>
    <p className='text-gray-600 dark:text-gray-300'>{message}</p>
    <div className='flex justify-end gap-3 mt-6'>
      <button
        onClick={onCancel}
        className='px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Confirm
      </button>
    </div>
  </div>
);
