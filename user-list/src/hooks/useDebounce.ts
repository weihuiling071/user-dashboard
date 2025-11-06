import {useEffect, useState} from 'react';

export default function useDebounce<T> (value: T, delay = 300) {
  const [debounced, setDebounced] = useState < T > (value);
  useEffect (
    () => {
      const h = setTimeout (() => setDebounced (value), delay);
      return () => clearTimeout (h);
    },
    [value, delay]
  );
  return debounced;
}
