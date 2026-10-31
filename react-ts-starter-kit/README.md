# React + TypeScript Starter Kit

Production-ready starter kit with Vite, TypeScript, ESLint, Prettier, Vitest, and built-in debugging utilities.

## Features

- ⚡ **Vite** — lightning-fast dev server and build
- 🔷 **TypeScript** — strict mode, zero `any`
- 🧹 **ESLint + Prettier** — consistent code style
- 🧪 **Vitest + Testing Library** — unit and component tests
- 🛡️ **Error Boundary** — graceful error handling
- 🔍 **Debug utilities** — render counter, safe JSON parse, logger
- 📱 **Responsive CSS** — mobile-first base styles

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── styles/         # CSS styles
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## Included Components

- **ErrorBoundary** — Catches render errors, shows fallback UI
- **DebugPanel** — Demo component showing debug utilities in action

## Included Hooks

- **useRenderCount** — Tracks component render count (dev only)

## Included Utils

- **debug** — Pretty-print any value to console
- **safeJsonParse** — Parse JSON without throwing

## License

MIT — free to use in personal and commercial projects.

---

Built by AG064 (Aleksey Aleksandrovich) — https://ag064.eu
For custom development work: contact@ag064.eu
