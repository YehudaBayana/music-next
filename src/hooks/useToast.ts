import { useContext, useCallback } from 'react';
import { ToastContext } from '../context/ToastContext';
import { ToastType } from '../components/toast/Toast';

type ToastOperation<T> = Promise<T> | (() => Promise<T>);
type ToastMessages = {
  loading?: string;
  success: string;
  error: string;
};

const useToast = () => {
  const { showToast, hideToast } = useContext(ToastContext);

  /**
   * Show a toast notification
   * @param message Message to display
   * @param type Type of toast (success, error, info)
   * @returns Toast ID
   */
  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      return showToast(message, type);
    },
    [showToast]
  );

  /**
   * Show a success toast
   * @param message Success message
   * @returns Toast ID
   */
  const success = useCallback(
    (message: string) => {
      return showToast(message, 'success');
    },
    [showToast]
  );

  /**
   * Show an error toast
   * @param message Error message
   * @returns Toast ID
   */
  const error = useCallback(
    (message: string) => {
      return showToast(message, 'error');
    },
    [showToast]
  );

  /**
   * Show an info toast
   * @param message Info message
   * @returns Toast ID
   */
  const info = useCallback(
    (message: string) => {
      return showToast(message, 'info');
    },
    [showToast]
  );

  /**
   * Run an async operation with toast notifications
   * @param operation Async operation to run
   * @param messages Toast messages for loading, success, and error states
   * @returns Result of the operation
   */
  const promise = useCallback(
    async <T>(
      operation: ToastOperation<T>,
      messages: ToastMessages
    ): Promise<T | undefined> => {
      let toastId: string | undefined;
      
      // Show loading toast if provided
      if (messages.loading) {
        toastId = showToast(messages.loading, 'info');
      }
      
      try {
        // Run the operation
        const result = typeof operation === 'function' ? await operation() : await operation;
        
        // Clear loading toast if it exists
        if (toastId) {
          hideToast(toastId);
        }
        
        // Show success toast
        showToast(messages.success, 'success');
        
        return result;
      } catch (err) {
        // Clear loading toast if it exists
        if (toastId) {
          hideToast(toastId);
        }
        
        // Show error toast
        const errorMessage = err instanceof Error ? err.message : messages.error;
        showToast(errorMessage, 'error');
        
        return undefined;
      }
    },
    [showToast, hideToast]
  );

  return {
    toast,
    success,
    error,
    info,
    promise,
  };
};

export default useToast;
