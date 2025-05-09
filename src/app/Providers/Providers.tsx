'use client';

import { Queue } from '@/components/Queue';
import { ContextMenuProvider } from '@/context/ContextMenuContext';
import { ModalProvider } from '@/context/ModalContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { QueueProvider } from '@/context/QueueContext';
import { ToastProvider } from '@/context/ToastContext';
import { SessionProvider } from 'next-auth/react';
import LikedTracksInitializer from '@/components/likeButton/LikedTracksInitializer';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ContextMenuProvider>
        <ModalProvider>
          <PlayerProvider>
            <QueueProvider>
              <ToastProvider>
                {/* Initialize liked tracks at app startup */}
                <LikedTracksInitializer />
                {children}
                <Queue />
              </ToastProvider>
            </QueueProvider>
          </PlayerProvider>
        </ModalProvider>
      </ContextMenuProvider>
    </SessionProvider>
  );
};

export default Providers;
