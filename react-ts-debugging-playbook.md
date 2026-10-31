# React & TypeScript Debugging Playbook
## A Practical Guide for Frontend Developers

### By AG064 (Aleksey Aleksandrovich)
### Version 1.0 — October 2026

---

## Table of Contents
1. Pre-Debug Checklist
2. Common React Bug Patterns (with fixes)
3. Debugging Toolkit (copy-paste snippets)
4. Client Communication Templates
5. Verification Checklist
6. Quick Reference Card

---

## 1. Pre-Debug Checklist

Before touching any code, verify these:

- [ ] **Reproduce consistently** — Can you make the bug happen on demand? Document exact steps.
- [ ] **Check console** — Open DevTools → Console. Look for red errors AND yellow warnings.
- [ ] **Check Network tab** — Are there failed requests (4xx, 5xx)? Check request/response payloads.
- [ ] **Check React DevTools** — Inspect component props and state. Is the data what you expect?
- [ ] **Hard refresh** — Ctrl+Shift+R (or Cmd+Shift+R). Rule out caching.
- [ ] **Incognito mode** — Extensions can interfere. Test in a clean browser.
- [ ] **Different browser** — Does it reproduce in Chrome, Firefox, Safari?
- [ ] **Check Git blame** — When was the affected code last changed? What PR introduced it?

**Time estimate:** 5-10 minutes. Do NOT skip this. 80% of "bugs" are environment or caching issues.

---

## 2. Common React Bug Patterns

### 2.1 State Not Updating

**Symptom:** You call setState but the UI doesn't change.

**Common causes:**

| Cause | Example | Fix |
|-------|---------|-----|
| Direct mutation | `state.items.push(newItem)` | Use spread: `setState([...state.items, newItem])` |
| Stale closure | `useEffect(() => { setState(count + 1) }, [])` | Use functional update: `setState(prev => prev + 1)` |
| Missing dependency | `useEffect(() => { fetchData(id) }, [])` | Add `id` to dependency array |
| Async state | `setState(value); console.log(state)` | State updates are async; use useEffect to react |

**Diagnostic snippet:**
```tsx
useEffect(() => {
  console.log('State changed:', state);
}, [state]);
```

### 2.2 Infinite Re-render Loop

**Symptom:** Browser freezes, "Maximum update depth exceeded" error.

**Common causes:**

| Cause | Example | Fix |
|-------|---------|-----|
| setState in render body | `if (condition) setState(true)` | Move to useEffect or event handler |
| New object in dependency | `useEffect(() => {}, [{ a: 1 }])` | Memoize: `const obj = useMemo(() => ({ a: 1 }), [])` |
| Missing dependency causes re-run | `useEffect(() => { setX(y + 1) }, [y])` where y changes | Check if the effect should run at all |

**Diagnostic:** Add a render counter (see Toolkit 3.2).

### 2.3 Form Not Submitting

**Symptom:** Clicking submit does nothing or shows wrong validation.

**Checklist:**
1. Is `onSubmit` wired to the `<form>` element (not the button)?
2. Does the handler call `e.preventDefault()`?
3. For controlled inputs: is `value` bound to state AND `onChange` updating state?
4. Does the validation schema match the form field names exactly?
5. Is the submit button `type="submit"` (not `type="button"`)?

**Common fix:**
```tsx
<form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <button type="submit">Submit</button>
</form>
```

### 2.4 API Data Not Loading

**Symptom:** Data doesn't appear, shows loading forever, or shows stale data.

**Diagnostic flow:**
1. Open Network tab → find the request → check status code
2. If 200: check response body — is the data there?
3. If 401/403: authentication issue — check token/headers
4. If 404: endpoint URL wrong — check base URL and path
5. If 500: backend issue — not your problem (but report it)
6. If CORS error: backend needs to allow your origin

**Common causes:**

| Cause | Fix |
|-------|-----|
| Missing `await` | Add `await` to fetch call |
| Race condition | Use AbortController to cancel stale requests |
| No error handling | Add try/catch with user-facing error message |
| Cache not invalidated | Refetch after mutation (React Query: `invalidateQueries`) |

**AbortController pattern:**
```tsx
useEffect(() => {
  const controller = new AbortController();
  fetchData(controller.signal);
  return () => controller.abort();
}, [id]);
```

### 2.5 Layout Broken on Mobile

**Symptom:** Elements overflow, misalign, or disappear on small screens.

**Checklist:**
1. Is `<meta name="viewport" content="width=device-width, initial-scale=1" />` in `<head>`?
2. Are you using fixed pixel widths? Switch to `%`, `vw`, `rem`, or `max-width`.
3. Test at 375px width (iPhone SE) — this is your minimum.
4. Check for `overflow: hidden` clipping content.
5. Flexbox: is `flex-wrap: wrap` set? Grid: is `auto-fit` or `minmax` used?

**Quick test:** Chrome DevTools → Toggle device toolbar → select iPhone SE.

### 2.6 TypeScript Build Failure

**Symptom:** `tsc` or `vite build` fails with type errors.

**Reading the error:**
- `Type 'X' is not assignable to type 'Y'` → You're passing the wrong type. Check the function/component signature.
- `Property 'X' does not exist on type 'Y'` → Typo, or the type definition is missing. Check imports.
- `Cannot find module 'X'` → Package not installed, or path alias misconfigured.
- `Circular dependency detected` → Two files import each other. Refactor to break the cycle.

**Common fixes:**
- Use `as` for type assertions only when you're certain: `value as ExpectedType`
- Use optional chaining for nullable: `user?.name`
- Use nullish coalescing for defaults: `value ?? 'default'`
- Don't use `any` — use `unknown` and narrow with type guards.

### 2.7 Hydration Mismatch (SSR/Next.js)

**Symptom:** "Text content does not match server-rendered HTML" or "Hydration failed."

**Common causes:**

| Cause | Fix |
|-------|-----|
| `Date.now()` or `Math.random()` in render | Move to useEffect |
| Browser-only API (`window`, `localStorage`) in render | Guard with `typeof window !== 'undefined'` or use useEffect |
| Date formatting differences (server vs client timezone) | Use consistent formatting library (date-fns, dayjs) |
| Conditional rendering based on client state | Use `useEffect` + state to defer client-only rendering |

**Safe pattern:**
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null; // or a skeleton
```

---

## 3. Debugging Toolkit (Copy-Paste Snippets)

### 3.1 Quick Logger
```typescript
export const debug = (label: string, value: unknown): void => {
  console.log(`[${label}]`, JSON.stringify(value, null, 2));
};
```

### 3.2 Render Counter
```tsx
import { useRef } from 'react';

export function useRenderCount(name: string): number {
  const count = useRef(0);
  count.current += 1;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${name}] render #${count.current}`);
  }
  return count.current;
}
```

### 3.3 Prop Change Tracker
```tsx
import { useRef, useEffect } from 'react';

export function useWhyDidYouUpdate(
  name: string,
  props: Record<string, unknown>
): void {
  const prev = useRef<Record<string, unknown>>({});
  useEffect(() => {
    const changed: Record<string, { from: unknown; to: unknown }> = {};
    Object.keys(props).forEach((key) => {
      if (prev.current[key] !== props[key]) {
        changed[key] = { from: prev.current[key], to: props[key] };
      }
    });
    if (Object.keys(changed).length > 0) {
      console.log(`[${name}] changed props:`, changed);
    }
    prev.current = props;
  });
}
```

### 3.4 API Request Tracer
```typescript
export async function traceRequest(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const start = performance.now();
  try {
    const res = await fetch(url, options);
    const ms = (performance.now() - start).toFixed(2);
    console.log(
      `%c[${res.status}] ${url} — ${ms}ms`,
      res.ok ? 'color: green' : 'color: red'
    );
    return res;
  } catch (err) {
    const ms = (performance.now() - start).toFixed(2);
    console.error(`[ERR] ${url} — ${ms}ms`, err);
    throw err;
  }
}
```

### 3.5 Safe JSON Parse
```typescript
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
```

### 3.6 Debounce
```typescript
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
```

### 3.7 Deep Equality Check
```typescript
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
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
```

---

## 4. Client Communication Templates

### 4.1 Bug Report Intake (send to client)
```
To help me fix this quickly, please provide:

1. Steps to reproduce (exact clicks/actions)
2. Expected behavior vs. current behavior
3. Browser + device + OS
4. Console errors (screenshot or copy-paste)
5. Network tab (any failed requests?)
6. Repository access or project archive
7. Local setup instructions + env vars (no production secrets)
```

### 4.2 Fix Summary (send with delivery)
```
## Fix Summary

**Issue:** [one-line description]
**Root cause:** [what was actually wrong]
**Fix:** [what was changed]

### Changes
| File | Change |
|------|--------|
| path/to/file.tsx | Description of change |

### How to verify
1. [Step to reproduce original bug]
2. [Expected behavior after fix]

### Tests performed
- [x] Bug no longer reproduces
- [x] No new console errors
- [x] Existing tests pass
- [x] Mobile checked (if relevant)
```

### 4.3 Out of Scope Response
```
Thanks for the detailed report. The issue you described involves [X], which is outside the scope of this bug fix (it would require [Y — e.g., a backend change / new feature / redesign]).

I can handle this as a separate task. Would you like me to provide a quote for that work?
```

---

## 5. Verification Checklist (Before Delivery)

- [ ] Bug no longer reproduces in the original environment
- [ ] No new console errors or warnings introduced
- [ ] All existing tests still pass
- [ ] Fix works on mobile (if UI-related)
- [ ] No debug `console.log` statements left in code
- [ ] Code is clean and follows project conventions
- [ ] Fix summary document written
- [ ] Client has been notified

---

## 6. Quick Reference Card

| Problem | First thing to check |
|---------|---------------------|
| State not updating | Are you mutating directly? Using functional update? |
| Infinite loop | setState in render? New object in deps? |
| Form not working | onSubmit on form? e.preventDefault()? Controlled inputs wired? |
| API not loading | Network tab status code. Auth token present? |
| Mobile broken | Viewport meta tag? Fixed widths? Test at 375px. |
| TS build failing | Read the error. Check imports and types. |
| Hydration mismatch | Browser-only code in render? Date/random in render? |

---

## About the Author

Aleksey Aleksandrovich — Full-Stack Developer & AI Engineer based in Estonia.
Kood/Jõhvi Full-Stack Mastery graduate (1,160 hours).
Portfolio: https://ag064.eu | GitHub: https://github.com/AG064

This playbook is part of the AG064 developer toolkit series.
For custom development work, visit: https://ag064.eu

---

*© 2026 AG064. All rights reserved. This document may be shared for personal use.*
*For commercial licensing or custom versions, contact: contact@ag064.eu*
