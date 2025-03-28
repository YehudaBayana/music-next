'use client';

import { Queue } from '@/components/Queue';
import { ContextMenuProvider } from '@/context/ContextMenuContext';
import { ModalProvider } from '@/context/ModalContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { QueueProvider } from '@/context/QueueContext';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ContextMenuProvider>
        <ModalProvider>
          <PlayerProvider>
            <QueueProvider>
              {children}
              <Queue />
            </QueueProvider>
          </PlayerProvider>
        </ModalProvider>
      </ContextMenuProvider>
    </SessionProvider>
  );
};

export default Providers;
