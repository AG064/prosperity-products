import { useRef, useEffect } from 'react';

export function useRenderCount(name: string): number {
  const count = useRef(0);
  count.current += 1;
  if (import.meta.env.DEV) {
    console.log(`[${name}] render #${count.current}`);
  }
  return count.current;
}
