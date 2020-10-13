import { useEffect, useState } from 'react';

export { SocketIOProvider, useSocketIO } from './SocketIOService'

export const useStateWithLocalStorage = (localStorageKey, defaultValue) => {
  const [value, setValue] = useState(
    localStorage.getItem(localStorageKey) || defaultValue
  );
 
  useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [localStorageKey, value]);
 
  return [value, setValue];
};