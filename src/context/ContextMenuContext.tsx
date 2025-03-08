// context/context-menu.tsx
'use client';

import ContextMenu from '@/components/contextMenu/ContextMenu';
import { MenuOption } from '@/components/contextMenu/types';
import { createContext, useContext, useEffect, useState } from 'react';

type ContextMenuState = {
  position: { x: number; y: number } | null;
  options: MenuOption[];
};

const ContextMenuContext = createContext<{
  contextMenu: ContextMenuState | null;
  setContextMenu: (menu: ContextMenuState | null) => void;
}>({ contextMenu: null, setContextMenu: () => {} });

export const ContextMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (contextMenu) setContextMenu(null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [contextMenu, setContextMenu]);

  return (
    <ContextMenuContext.Provider value={{ contextMenu, setContextMenu }}>
      {children}
      {contextMenu && (
        <ContextMenu
          options={contextMenu.options}
          position={contextMenu.position!}
          onClose={() => setContextMenu(null)}
        />
      )}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => useContext(ContextMenuContext);
