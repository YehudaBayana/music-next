# Toast Functionality

This directory contains a custom toast hook for displaying notifications about server operations.

## Usage

### Basic Usage

```tsx
import useToast from '@/hooks/useToast';

function MyComponent() {
  const toast = useToast();
  
  const handleClick = () => {
    // Show different types of toasts
    toast.success('Operation completed successfully');
    toast.error('Operation failed');
    toast.info('Loading data...');
  };
  
  return <button onClick={handleClick}>Perform Action</button>;
}
```

### With Promises

```tsx
import useToast from '@/hooks/useToast';
import { myApiCall } from '@/api';

function MyComponent() {
  const toast = useToast();
  
  const handleSave = async () => {
    // Automatically shows success or error toast based on promise result
    const result = await toast.promise(
      myApiCall(),
      {
        success: 'Data saved successfully!',
        error: 'Failed to save data', 
      }
    );
    
    return result;
  };
  
  return <button onClick={handleSave}>Save Data</button>;
}
```

### With Loading State

```tsx
import useToast from '@/hooks/useToast';
import { myApiCall } from '@/api';

function MyComponent() {
  const toast = useToast();
  
  const handleFetchData = async () => {
    // Shows loading, success, and error states
    const result = await toast.promise(
      myApiCall(),
      {
        loading: 'Fetching data...',
        success: 'Data fetched successfully!',
        error: 'Failed to fetch data',
      }
    );
    
    return result;
  };
  
  return <button onClick={handleFetchData}>Fetch Data</button>;
}
```

## API

The `useToast` hook provides the following methods:

- `toast(message, type)` - Show a toast with a specified type ('success', 'error', 'info')
- `success(message)` - Show a success toast
- `error(message)` - Show an error toast
- `info(message)` - Show an info toast
- `promise(operation, messages)` - Run an async operation with toast notifications for different states

Toasts automatically disappear after 5 seconds or can be manually dismissed.
