'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the IOSInstallPrompt component
const IOSInstallPrompt = dynamic(() => import('./IOSInstallPrompt'), {
  ssr: false,
});

const InstallButton: React.FC = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [forceShowButton, setForceShowButton] = useState(false);

  useEffect(() => {
    // Skip in server-side rendering
    if (typeof window === 'undefined') return;
    
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if app is in standalone mode (already installed)
    const standalone = 'standalone' in window.navigator && (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Always show the button for iOS devices that haven't installed the app
    // Check if we recently showed the prompt
    const lastPrompt = localStorage.getItem('pwaPromptDismissed');
    const showAgain = !lastPrompt || (Date.now() - Number(lastPrompt)) > 1000 * 60 * 60 * 12; // 12 hours
    
    if (iOS && !standalone && showAgain) {
      // Show button immediately
      setForceShowButton(true);
      
      // Show the full prompt after a short delay to not interrupt immediate user actions
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClick = () => {
    setShowPrompt(true);
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  // If not iOS or already installed as PWA, don't show anything
  if (!isIOS || isStandalone) {
    return null;
  }

  return (
    <>
      {forceShowButton && !showPrompt && (
        <button 
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center space-x-2 animate-pulse shadow-green-500/30"
          aria-label="Install App"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Install App</span>
        </button>
      )}
      
      {showPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <IOSInstallPrompt onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;
