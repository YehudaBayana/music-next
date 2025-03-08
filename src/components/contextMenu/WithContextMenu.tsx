// components/WithContextMenu.tsx
'use client';

import { WithContextMenuProps } from '@/components/contextMenu/types';
import { useContextMenu } from '@/context/ContextMenuContext';
// import { useId } from 'react';
// import { useContextMenu } from '@/context/context-menu';

export const WithContextMenu = ({
  options,
  children,
  className,
  triggerType = 'right-click',
}: WithContextMenuProps) => {
  const { setContextMenu } = useContextMenu();
  // const id = useId();

  const handleTrigger = (e: React.MouseEvent) => {
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
    if (x + 200 > viewportWidth + scrollX) x = viewportWidth + scrollX - 200;
    if (y + 200 > viewportHeight + scrollY) y = e.clientY + scrollY - 200;

    setContextMenu({
      position: { x, y },
      options,
    });
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleTrigger(touch as unknown as React.MouseEvent);
  };

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
