// Sidebar.tsx
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import NavigationList from './NavigationList';
import { navigationItems, libraryItems, podcastItems } from './sidebarData';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar (Hidden on small screens) */}
      <div className='bg-secondary w-64 h-screen fixed top-0 left-0 p-6 overflow-auto hidden sm:flex flex-col'>
        <div className='flex flex-col items-center mb-8'>
          {/* <SicupLogo width='24' /> */}
          <h1 className='text-lg font-semibold'>user name</h1>
        </div>

        <div className='space-y-4'>
          <nav>
            <NavigationList
              setIsOpen={setIsOpen}
              items={navigationItems}
              pathname={pathname!}
            />
          </nav>

          <div>
            <h2 className='text-xs uppercase tracking-wide mb-2'>Library</h2>
            <NavigationList
              setIsOpen={setIsOpen}
              items={libraryItems}
              pathname={pathname!}
            />
          </div>

          <div>
            <h2 className='text-xs uppercase tracking-wide mb-2'>Podcasts</h2>
            <NavigationList
              setIsOpen={setIsOpen}
              items={podcastItems}
              pathname={pathname!}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className='sm:hidden flex justify-start items-start fixed top-4 left-4 z-50 bg-primary text-textBase p-2 rounded-md'
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className='block w-6 h-6 relative'>
            <span className='absolute left-0 top-1/2 w-6 h-0.5 bg-white transform -rotate-45 origin-center'></span>
            <span className='absolute left-0 top-1/2 w-6 h-0.5 bg-white transform rotate-45 origin-center'></span>
          </span>
        ) : (
          <span className='block w-6 h-6 relative'>
            <span className='absolute left-0 top-1 bg-white w-6 h-0.5'></span>
            <span className='absolute left-0 top-1/2 bg-white w-6 h-0.5 -translate-y-1/2'></span>
            <span className='absolute left-0 bottom-1 bg-white w-6 h-0.5'></span>
          </span>
        )}
      </button>

      {/* Mobile Sidebar (Overlay) */}
      {isOpen && (
        <div className='bg-secondary w-64 h-screen fixed top-0 left-0 p-6 overflow-auto flex flex-col z-40'>
          <div className='flex flex-col items-center mb-8'>
            {/* <SicupLogo width='24' /> */}
            <h1 className='text-lg font-semibold'>user name</h1>
          </div>

          <div className='space-y-4'>
            <nav>
              <NavigationList
                setIsOpen={setIsOpen}
                items={navigationItems}
                pathname={pathname!}
              />
            </nav>

            <div>
              <h2 className='text-xs uppercase tracking-wide mb-2'>Library</h2>
              <NavigationList
                setIsOpen={setIsOpen}
                items={libraryItems}
                pathname={pathname!}
              />
            </div>

            <div>
              <h2 className='text-xs uppercase tracking-wide mb-2'>Podcasts</h2>
              <NavigationList
                setIsOpen={setIsOpen}
                items={podcastItems}
                pathname={pathname!}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
