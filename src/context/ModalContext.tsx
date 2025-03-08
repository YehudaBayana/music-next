'use client';

import Modal from '@/components/modal/Modal';
import { createContext, useContext, useState } from 'react';

type ModalProps = {
  content: React.ReactNode;
  modalProps?: Record<string, unknown>;
};

type ModalContextType = {
  openModal: (
    content: React.ReactNode,
    modalProps?: Record<string, unknown>
  ) => void;
  closeModal: () => void;
  modalState: ModalProps | null;
};

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  modalState: null,
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalState, setModalState] = useState<ModalProps | null>(null);

  const openModal = (
    content: React.ReactNode,
    modalProps?: Record<string, unknown>
  ) => {
    setModalState({ content, modalProps });
  };

  const closeModal = () => {
    setModalState(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalState }}>
      {children}
      {modalState && (
        <Modal onClose={closeModal} {...modalState.modalProps}>
          {modalState.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
