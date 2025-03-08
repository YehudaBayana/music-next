'use client';

import { ContextMenuProvider } from '@/context/ContextMenuContext';
import { ModalProvider } from '@/context/ModalContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ContextMenuProvider>
        <ModalProvider>
          <PlayerProvider>{children}</PlayerProvider>
        </ModalProvider>
      </ContextMenuProvider>
    </SessionProvider>
  );
};

export default Providers;
