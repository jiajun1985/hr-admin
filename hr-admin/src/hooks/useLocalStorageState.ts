import { useState, useCallback, useRef } from 'react';
import { getDemoStorage, resetDemoStorageKey, setDemoStorage } from './demoStorage';

export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const getStoredValue = useCallback((): T => {
    return getDemoStorage(key, initialValue);
  }, [key, initialValue]);

  const initialValueRef = useRef(initialValue);
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          setDemoStorage(key, valueToStore);
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error updating localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  const reset = useCallback(() => {
    resetDemoStorageKey(key);
    setStoredValue(initialValueRef.current);
  }, [key]);

  return [storedValue, setValue, reset];
}
