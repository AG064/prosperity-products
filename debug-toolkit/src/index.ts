/**
 * React & TypeScript Debugging Toolkit
 * A collection of reusable debugging utilities for React/TypeScript projects.
 * Part of the "Frontend Debugging Playbook" digital product.
 *
 * Usage:
 *   import { debug, useRenderCount, traceRequest } from './debug-toolkit';
 */

// ─── Quick Logger ────────────────────────────────────────────────
export const debug = (label: string, value: unknown): void => {
  console.log(`[${label}]`, JSON.stringify(value, null, 2));
};

export const debugTable = (label: string, data: unknown): void => {
  console.group(`[${label}]`);
  console.table(data);
  console.groupEnd();
};

// ─── Render Counter Hook ─────────────────────────────────────────
import { useRef, useEffect } from 'react';

export function useRenderCount(componentName: string): number {
  const count = useRef(0);
  count.current += 1;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${componentName}] rendered ${count.current} time(s)`);
  }
  return count.current;
}

// ─── Why Did You Render (prop change tracker) ───────────────────
export function useWhyDidYouUpdate(
  name: string,
  props: Record<string, unknown>
): void {
  const prevProps = useRef<Record<string, unknown>>({});
  useEffect(() => {
    if (prevProps.current) {
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};
      Object.keys(props).forEach((key) => {
        if (prevProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });
      if (Object.keys(changedProps).length > 0) {
        console.log(`[${name}] changed props:`, changedProps);
      }
    }
    prevProps.current = props;
  });
}

// ─── API Request Tracer ──────────────────────────────────────────
export async function traceRequest(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const start = performance.now();
  try {
    const res = await fetch(url, options);
    const duration = (performance.now() - start).toFixed(2);
    console.log(
      `%c[${res.status}] ${url} — ${duration}ms`,
      res.ok ? 'color: green' : 'color: red'
    );
    return res;
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    console.error(`[ERR] ${url} — ${duration}ms`, err);
    throw err;
  }
}

// ─── Safe JSON Parse ─────────────────────────────────────────────
export function safeJsonParse<T = unknown>(
  value: string,
  fallback: T
): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// ─── Debounce / Throttle ─────────────────────────────────────────
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

// ─── Deep Equality Check ─────────────────────────────────────────
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== 'object') return false;
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) =>
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  );
}

// ─── Format Utilities ────────────────────────────────────────────
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};
