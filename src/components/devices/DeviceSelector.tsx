'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { spotifyClient } from '@/api/spotifyClient';
import { useSession } from 'next-auth/react';
import { usePlayer } from '@/context/PlayerContext';
import {
  FaSpeakerDeck,
  FaMobileAlt,
  FaLaptop,
  FaDesktop,
  FaHeadphones,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { thisDeviceName } from '@/utils/constants';

interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

const DeviceSelector = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Initial loading state
  const [isUpdating, setIsUpdating] = useState(false); // For background refreshes
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session } = useSession();
  const { deviceId, setDeviceId } = usePlayer();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initialFetchRef = useRef<boolean>(false);

  // Fetch available devices
  const fetchDevices = useCallback(
    async (silent = false) => {
      if (!session?.accessToken) return;

      try {
        if (!silent) {
          setIsUpdating(true);
        }

        const response = await spotifyClient.getAvailableDevices();

        if (response && response.devices) {
          // If this is our first successful fetch, mark as initialized
          if (!isInitialized) {
            setIsInitialized(true);
            setIsInitializing(false);
          }

          // Preserve the active device selection when just refreshing the list
          if (devices.length > 0 && activeDevice) {
            // Update the devices list but maintain our active selection
            const updatedDevices = response.devices;
            setDevices(updatedDevices);

            // Check if our active device still exists and update its status
            const currentActive = updatedDevices.find(
              (d) => d.id === activeDevice.id
            );
            if (currentActive) {
              setActiveDevice(currentActive);
            } else {
              // Our active device is gone, select a new active one
              const newActive = updatedDevices.find((d) => d.is_active);
              if (newActive) {
                setActiveDevice(newActive);
              } else if (updatedDevices.length > 0) {
                setActiveDevice(updatedDevices[0]);
              } else {
                setActiveDevice(null);
              }
            }
          } else {
            // First load or no active device yet
            setDevices(response.devices);

            const active = response.devices.find((d) => d.is_active);
            if (active) {
              setActiveDevice(active);
            } else if (response.devices.length > 0) {
              setActiveDevice(response.devices[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        if (!silent) {
          setIsUpdating(false);
        }
      }
    },
    [activeDevice, devices.length, isInitialized, session?.accessToken]
  );

  // Handle device change
  const handleDeviceChange = async (device: Device) => {
    try {
      setIsUpdating(true);
      // Save the device we're switching to
      setActiveDevice(device);
      if (device.id) {
        setDeviceId(device.id);
      }
      setIsOpen(false);

      // Transfer playback to selected device with the play parameter set to true
      // This ensures playback continues on the new device
      await spotifyClient.transferPlayback([device.id], true);

      // After a short delay, fetch devices again to confirm the change
      setTimeout(() => fetchDevices(true), 1000);
    } catch (error) {
      console.error('Error transferring playback:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Setup initial load and periodic refreshes
  useEffect(() => {
    if (session?.accessToken && !initialFetchRef.current) {
      initialFetchRef.current = true;

      // Initial delay to allow Spotify SDK to initialize
      const initialDelay = setTimeout(async () => {
        await fetchDevices();

        // If we still don't have devices, set up a retry mechanism
        if (devices.length === 0) {
          let retryCount = 0;
          const maxRetries = 5;

          const retryInterval = setInterval(async () => {
            retryCount++;
            console.log(
              `Retrying device fetch (${retryCount}/${maxRetries})...`
            );

            await fetchDevices();

            if (devices.length > 0 || retryCount >= maxRetries) {
              clearInterval(retryInterval);
              setIsInitializing(false);
            }
          }, 3000);

          return () => clearInterval(retryInterval);
        }
      }, 2000);

      // Setup background refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        // Only do silent refreshes after initialization
        if (isInitialized) {
          fetchDevices(true);
        }
      }, 30000);

      return () => {
        clearTimeout(initialDelay);
        clearInterval(refreshInterval);
      };
    }
  }, [devices.length, fetchDevices, isInitialized, session?.accessToken]);

  // Update active device when deviceId changes in context
  useEffect(() => {
    if (deviceId && devices.length > 0) {
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        setActiveDevice(device);
      }
    }
  }, [deviceId, devices]);

  // Get icon based on device type
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'smartphone':
        return <FaMobileAlt className='mr-2' />;
      case 'computer':
        return <FaLaptop className='mr-2' />;
      case 'speaker':
        return <FaSpeakerDeck className='mr-2' />;
      case 'headphones':
        return <FaHeadphones className='mr-2' />;
      default:
        return <FaDesktop className='mr-2' />;
    }
  };

  // Show initialization state
  if (isInitializing) {
    return (
      <div className='text-black text-sm p-2 border border-gray-300 rounded-md bg-white/90 w-full text-center flex items-center justify-center gap-2'>
        <div className='animate-pulse h-4 w-4 bg-blue-500 rounded-full'></div>
        <span>Initializing Spotify...</span>
      </div>
    );
  }

  // Show message when no devices available after initialization
  if (isInitialized && devices.length === 0) {
    return (
      <div className='text-black text-sm p-2 border border-gray-300 rounded-md bg-white/90 w-full text-center'>
        No available devices
      </div>
    );
  }

  return (
    <div className='relative text-black' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className='flex items-center justify-between bg-white/90 border border-gray-300 rounded-md px-2 py-2 w-full hover:bg-white transition-colors text-sm'
        title='Select playback device'
      >
        <div className='flex items-center truncate'>
          {activeDevice && (
            <>
              {getDeviceIcon(activeDevice.type)}
              <span className='truncate mr-1'>
                {activeDevice.name === thisDeviceName
                  ? 'This device'
                  : activeDevice.name}
              </span>
            </>
          )}
          {!activeDevice && 'Select device'}
        </div>
        {isUpdating ? (
          <div className='animate-spin h-3 w-3 border-2 border-blue-500 rounded-full border-t-transparent'></div>
        ) : isOpen ? (
          <FaChevronUp size={10} />
        ) : (
          <FaChevronDown size={10} />
        )}
      </button>

      {isOpen && (
        <div className='absolute z-20 mt-1 w-full lg:w-[220px] left-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
          {devices.map((device) => (
            <div
              key={device.id}
              onClick={() => handleDeviceChange(device)}
              className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                activeDevice?.id === device.id ? 'bg-gray-100' : ''
              }`}
            >
              {getDeviceIcon(device.type)}
              <div className='flex flex-col overflow-hidden'>
                <span className='font-medium truncate text-sm'>
                  {device.name === thisDeviceName ? 'This device' : device.name}
                </span>
                {device.is_active && (
                  <span className='text-xs text-green-600'>
                    Currently active
                  </span>
                )}
              </div>
            </div>
          ))}
          <div
            className='flex items-center justify-center px-3 py-2 text-xs text-blue-600 border-t border-gray-200 cursor-pointer hover:bg-gray-100'
            onClick={() => fetchDevices()}
          >
            Refresh devices
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceSelector;
