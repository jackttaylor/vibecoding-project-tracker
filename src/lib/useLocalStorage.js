import { useEffect, useState } from 'react';

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 * `initialValue` may be a function (called once, only when nothing is stored).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {
      /* private mode / blocked storage — fall through to the default */
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
