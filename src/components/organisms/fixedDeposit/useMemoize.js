import { useMemo, useCallback } from 'react';

const useMemoize = (fn) => {
  const cache = useMemo(() => ({}), []); // Cache is created once and persists throughout the component's lifecycle

  return useCallback(
    async (id, ...args) => {
      if (cache[id] !== undefined) {
        console.log('Using cached result');
        return cache[id];
      }
      const result = await fn(...args);
      cache[id] = result;
      return result;
    },
    [cache, fn]
  );
};

export default useMemoize;
