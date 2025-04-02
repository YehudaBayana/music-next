// components/WithContextMenu.tsx
'use client';

import { WithContextMenuProps } from '@/components/contextMenu/types';
import { useContextMenu } from '@/context/ContextMenuContext';
import { useEffect, useState } from 'react';

export const WithContextMenu = ({
  options,
  children,
  className,
  triggerType = 'right-click',
}: WithContextMenuProps) => {
  const { setContextMenu } = useContextMenu();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (triggerType === 'right-click') e.preventDefault();

    // Calculate position with scroll offset
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get raw position
    let x = e.clientX + scrollX;
    let y = e.clientY + scrollY;

    // Adjust for viewport boundaries (assuming menu is 200x200)
    if (x + 200 > viewportWidth + scrollX) x = viewportWidth + scrollX - 300;
    if (y + 200 > viewportHeight + scrollY) y = e.clientY + scrollY - 200;

    setContextMenu({
      position: { x, y },
      options,
    });
    setMenuVisible(true);
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const touch = e.touches[0];
    handleTrigger(touch as unknown as React.MouseEvent);
  };

  // Close the context menu if the user starts scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (menuVisible) {
        setContextMenu({ position: { x: 0, y: 0 }, options: [] }); // Close the context menu
        setMenuVisible(false); // Update menu visibility state
      }
    };

    if (menuVisible) {
      window.addEventListener('scroll', handleScroll);
    }

    // Cleanup the event listener on unmount or when menu is closed
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuVisible, setContextMenu]);

  return (
    <div
      className={className}
      {...(triggerType === 'right-click'
        ? { onContextMenu: handleTrigger }
        : { onClick: handleTrigger })}
      onTouchEnd={triggerType === 'click' ? handleTouch : undefined}
    >
      {children}
    </div>
  );
};
