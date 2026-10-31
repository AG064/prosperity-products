import React, { useState } from 'react';
import { useRenderCount } from '../hooks/useRenderCount';
import { debug } from '../utils/debug';

export function DebugPanel() {
  const [count, setCount] = useState(0);
  const renders = useRenderCount('DebugPanel');

  const handleClick = () => {
    setCount((c) => c + 1);
    debug('DebugPanel', { count: count + 1, renders });
  };

  return (
    <section>
      <h2>Debug Panel (Demo)</h2>
      <p>Render count: {renders}</p>
      <p>Click count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </section>
  );
}
