'use client';

import React, { useState, useEffect } from 'react';

interface IOSInstallPromptProps {
  onClose?: () => void;
}

const IOSInstallPrompt: React.FC<IOSInstallPromptProps> = ({ onClose }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if the app is already installed (in standalone mode)
    const standalone =
      'standalone' in window.navigator &&
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check localStorage to see if the prompt was recently dismissed
    const lastPrompt = localStorage.getItem('pwaPromptDismissed');
    const showAgain =
      !lastPrompt || Date.now() - Number(lastPrompt) > 1000 * 60 * 60 * 24; // Show again after 24 hours

    // Show the prompt after a delay if it's iOS and not in standalone mode
    if (iOS && !standalone && showAgain) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePrompt = () => {
    setShowPrompt(false);
    // Save to localStorage to prevent showing it again for a while
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());

    // Call the onClose prop if provided
    if (onClose) {
      onClose();
    }
  };

  if (!isIOS || isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className='bg-gray-900 text-white p-6 rounded-xl shadow-lg'>
      <div className='flex items-start'>
        <div className='flex-1'>
          <div className='flex items-center mb-2'>
            <div className='w-10 h-10 mr-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-bold'>
              Install Spotify Clone on your iPhone
            </h3>
          </div>
          <p className='text-sm mb-3'>
            For the best experience, add this app to your home screen:
          </p>

          <div className='bg-amber-800/30 text-amber-200 p-3 rounded-lg mb-4 flex items-start'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2 mt-0.5 flex-shrink-0'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <div>
              <span className='font-bold block mb-1'>Important:</span>
              <span>
                You <strong>must be using Safari</strong> for this installation
                to work. If you are in another browser or in-app browser, please
                open this site in Safari first.
              </span>
            </div>
          </div>
          <ol className='text-sm list-decimal pl-5 space-y-3'>
            <li>
              In Safari, tap the share button{' '}
              <span className='inline-block w-8 h-8 align-middle text-center rounded-md bg-gradient-to-b from-gray-700 to-gray-800 mx-1 flex items-center justify-center shadow-md'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'></path>
                  <polyline points='16 6 12 2 8 6'></polyline>
                  <line x1='12' y1='2' x2='12' y2='15'></line>
                </svg>
              </span>{' '}
              in the toolbar at the bottom of the screen
              <p className='text-xs mt-1 text-gray-400'>
                If you do not see the toolbar, tap once at the center of the
                screen to reveal it.
              </p>
            </li>
            <li>
              In the share sheet that appears, scroll down to find and tap{' '}
              <div className='inline-flex items-center bg-gray-700 rounded-lg px-3 py-1 my-1 mx-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mr-2'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
                  <line x1='12' y1='8' x2='12' y2='16'></line>
                  <line x1='8' y1='12' x2='16' y2='12'></line>
                </svg>
                <span className='font-medium'>Add to Home Screen</span>
              </div>
            </li>
            <li>On the next screen, you can rename the app if you wish</li>
            <li>
              Tap the{' '}
              <span className='inline-block bg-blue-500 text-white px-3 py-1 rounded-md font-medium'>
                Add
              </span>{' '}
              button in the top right corner
            </li>
          </ol>
          <div className='mt-4 mb-2 px-2 py-3 bg-gray-800 rounded-lg'>
            <p className='text-xs text-center mb-2 text-gray-300'>
              Visual Guide for iOS Installation
            </p>
            <div className='flex justify-around items-center'>
              <div className='text-center'>
                <div className='w-14 h-14 mx-auto mb-1 flex items-center justify-center bg-gray-700 rounded-lg'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'></path>
                    <polyline points='16 6 12 2 8 6'></polyline>
                    <line x1='12' y1='2' x2='12' y2='15'></line>
                  </svg>
                </div>
                <p className='text-xs'>1. Tap Share</p>
              </div>
              <div className='text-gray-500'>→</div>
              <div className='text-center'>
                <div className='w-14 h-14 mx-auto mb-1 flex items-center justify-center bg-gray-700 rounded-lg'>
                  <div className='flex flex-col items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <rect
                        x='3'
                        y='3'
                        width='18'
                        height='18'
                        rx='2'
                        ry='2'
                      ></rect>
                      <line x1='12' y1='8' x2='12' y2='16'></line>
                      <line x1='8' y1='12' x2='16' y2='12'></line>
                    </svg>
                    <span className='text-xs mt-1'>Home</span>
                  </div>
                </div>
                <p className='text-xs'>2. Add to Home Screen</p>
              </div>
              <div className='text-gray-500'>→</div>
              <div className='text-center'>
                <div className='w-14 h-14 mx-auto mb-1 flex items-center justify-center bg-gray-700 rounded-lg'>
                  <div className='flex items-center justify-center h-8 w-12 rounded-md bg-blue-500'>
                    <span className='text-xs font-bold'>Add</span>
                  </div>
                </div>
                <p className='text-xs'>3. Tap Add</p>
              </div>
            </div>
          </div>
          <div className='bg-amber-800/30 text-amber-200 p-3 rounded-lg mb-4 mt-1 flex items-start'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2 mt-0.5 flex-shrink-0'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <div>
              <span className='font-bold block mb-1'>Important:</span>
              <span>
                You <strong>must be using Safari</strong> for this installation
                to work. If you are in another browser or in-app browser, please
                open this site in Safari first.
              </span>
            </div>
          </div>
          <div className='mt-3 flex justify-between items-center'>
            <button
              onClick={closePrompt}
              className='text-sm text-green-400 hover:text-green-300 font-medium'
            >
              Remind me later
            </button>
            <button
              onClick={closePrompt}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium'
            >
              Got it!
            </button>
          </div>
        </div>
        <button
          onClick={closePrompt}
          className='ml-2 p-2 text-sm text-gray-400 hover:text-white'
          aria-label='Dismiss'
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default IOSInstallPrompt;
