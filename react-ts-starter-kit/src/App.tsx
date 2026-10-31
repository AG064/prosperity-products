import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DebugPanel } from './components/DebugPanel';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <header>
          <h1>React + TypeScript Starter Kit</h1>
          <p>Production-ready. Debugging included.</p>
        </header>
        <main>
          <DebugPanel />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
