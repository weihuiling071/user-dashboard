# User Dashboard — Microfrontend Monorepo

This repository is a small microfrontend example built with React, TypeScript and Webpack Module Federation. It contains a host/container application (`user-dashboard-shell`) and two remotes (`user-list`, `user-details`) plus a `shared` package that holds shared types, utilities and a React Context for user state.

This README documents the repository layout, architecture choices, inter-app communication strategy, Module Federation setup, performance and testing approaches, and how AI tools were used to accelerate development.

---

## 1. Repository layout

Top-level folders:

- `shared/` — shared utilities, types and the `UserContext` provider used by remotes and the shell
  - `api/userService.ts` — fetch/save helpers (wraps remote API + local persistence)
  - `communication/UserContext.tsx` — shared React Context + `UserProvider`
  - `types/User.ts` — TypeScript `User` interface

- `user-dashboard-shell/` — container (host) app
  - `webpack.config.js` — host Module Federation configuration
  - `src/` — shell source
    - `App.tsx`, `routes.js`, `sharedEntry.ts` — boot and route composition
    - `__mocks__/userListMock.js`, `userDetailsMock.js` — test mocks for remotes
    - `__tests__/Navbar.test.tsx` — example unit test

- `user-list/` — a microfrontend that lists users
  - `webpack.config.js` — remote Module Federation configuration
  - `src/` — list app source
    - `App.tsx` — exposes the list app
    - `pages/UserListPage.tsx`, `components/userTable.tsx` — UI components
    - `hooks/useDebounce.ts` — small performance utility

- `user-details/` — a microfrontend that shows and edits a user
  - `webpack.config.js` — remote Module Federation configuration
  - `src/` — details app source
    - `App.tsx`, `pages/UserDetailsPage.tsx`, `components/UserForm.tsx`

Each package has its own `package.json`, Babel and Jest config to run, build and test independently.

---

## 2. How this microfrontend application is structured

Design goals:
- Independent deployability: each microfrontend (`user-list`, `user-details`) can be built and deployed separately and exposes a `remoteEntry.js` for runtime consumption.
- Clear ownership: UI and routes belonging to a domain are implemented in that microfrontend.
- Shared domain model: types and cross-cutting code (API, context) live in `shared/` and are re-exported by the container via `sharedEntry.ts`.

Runtime composition:
- The shell (`user-dashboard-shell`) lazily imports routes and remote apps. It uses `React.lazy` + `Suspense` to load remote entries only when needed.
- Remotes call `UserProvider` (from shared) to access global user data or the shell can provide the context for them — the codebase supports both patterns (shared provider or consuming provider from the container).

Routing:
- `user-dashboard-shell/src/routes.js` registers routes like `/` (list) and `/user/:id` (details). Remotes are loaded lazily via Module Federation imports (e.g., `import('userList/App')`).

---

## 3. Inter-app communication and state management

Primary mechanism: Shared React Context (`UserContext`) exported from `shared/communication/UserContext.tsx`.

Why this approach:
- Lightweight and straightforward for the example
- Works well when the shell and remotes share a single React runtime (singleton `react`/`react-dom`) as configured in Module Federation

Provided capabilities:
- `users` array and `selectedUser` state
- `refresh()` action to refetch users from the API
- `updateUser()` to perform local optimistic updates + persist via `saveUserLocal()`

Notes on patterns and trade-offs:
- Centralized state via Context is simple and great for low to medium complexity. If you scale to many teams/apps, consider a message-bus pattern or a shared global store provider (e.g., tiny Redux store exposed via federation or an events layer using CustomEvents/SharedWorker).
- Persisting edits locally (localStorage) is implemented in `shared/api/userService.ts` for offline friendliness and for the demo.

---

## 4. Module Federation / microfrontend simulation setup

High-level config (host: `user-dashboard-shell/webpack.config.js`):

- Host exposes `./shared` via `sharedEntry.ts` so remotes can import shared helpers as `container/shared` during tests or local dev.
- Host remotes:
  - `userList: 'userList@http://localhost:3001/remoteEntry.js'`
  - `userDetails: 'userDetails@http://localhost:3002/remoteEntry.js'`
- Shared dependencies are marked as singletons to avoid duplicate React loads:
  - `react`, `react-dom`, `react-router-dom`, `axios`, `antd`

Example snippet from host:

```js
new ModuleFederationPlugin({
  name: 'container',
  filename: 'remoteEntry.js',
  remotes: {
    userList: 'userList@http://localhost:3001/remoteEntry.js',
    userDetails: 'userDetails@http://localhost:3002/remoteEntry.js',
  },
  exposes: {
    './shared': './src/sharedEntry',
  },
  shared: {
    react: { singleton: true, strictVersion: true },
    'react-dom': { singleton: true, strictVersion: true },
    'react-router-dom': { singleton: true },
  },
});
```

Remotes expose their apps (example `user-list/webpack.config.js`):

```js
new ModuleFederationPlugin({
  name: 'userList',
  filename: 'remoteEntry.js',
  exposes: { './App': './src/App' },
  remotes: { container: 'container@http://localhost:3000/remoteEntry.js' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});
```

Local development: run each package in its own terminal:

```bash
cd user-dashboard-shell && npm start   # port 3000
cd ../user-list && npm start          # port 3001
cd ../user-details && npm start       # port 3002
```

The host loads remote entries over HTTP from those ports.

---

## 5. Performance optimization techniques

Implemented and recommended practices used in this repo:

- Route-level code-splitting
  - Routes are loaded with `React.lazy(() => import('userList/App'))` so remotes only fetch code when needed.

- Shared singletons
  - Marking large libs (`react`, `react-dom`, `antd`) as shared singletons avoids duplicate copies and reduces bundle size.

- Small utilities and memoization
  - `useDebounce` (in `user-list`) is used to debounce user search input and avoid excessive re-renders or network calls.
  - Use `useMemo` for derived lists and `useCallback` for handlers to avoid unnecessary updates.

- Optimistic UI updates
  - `updateUser()` in the shared context updates local state immediately and persists changes asynchronously.

- Avoid heavy runtime dependencies on mount
  - Mock-heavy libraries are isolated from unit tests using jest mocks to keep test runs fast.

---

## 6. Testing strategy for a distributed frontend architecture

Each package is configured to run tests independently with Jest and React Testing Library.

Important patterns used in the repo:

- Per-package Jest config
  - Each package (`user-list`, `user-details`, `user-dashboard-shell`) has a `jest.config.js` and `jest.setup.js` to provide local polyfills, module name mappers and mocks.

- Module Federation testing shortcuts
  - For unit tests, remotes are mocked (see `user-dashboard-shell/src/__mocks__`) and `container/shared` is mapped using `moduleNameMapper` in tests so components can import shared types and hooks without loading a remote at runtime.

- Ant Design and DOM-heavy libs
  - Tests that render components using `antd` may need lightweight mocks for `Form`, `Input`, `Button` or `message` (the `user-details` tests use a test setup that stubs these to avoid portal/ResizeObserver issues under jsdom).

- Example test structure
  - `user-details/src/__tests__/UserForm.test.tsx` shows testing of a form component with `render`, `fireEvent`, `act` and `waitFor`.

- Coverage and CI
  - Each package collects coverage. For fast iteration the example temporarily lowers coverage thresholds during development; in production you should raise them and add more tests.

Recommended testing expansion
- Add small integration tests where the shell renders a mocked remote and verifies navigation between list/details.
- Add E2E tests (Cypress or Playwright) to validate the full runtime composition across server-hosted `remoteEntry.js` files.

---

## 7. How AI tools were leveraged for productivity under time constraints

Practical uses of AI in this project:
- Use ChatGpt and Copilot to generate some code.

- The core page components of this micro-frontend application were assisted by ChatGPT (GPT-5). AI was used to accelerate development by generating:
  - React + TypeScript components for each micro-frontend
  - Shared state management and communication layer
  - API integration logic based on JSONPlaceholder
  - UI interactions such as search debounce, pagination, routing, and optimistic updates
  - Initial SCSS styling structure

- Configuration generation & fixes
  - AI-assisted generation of Jest and Babel configs for proper JSX/TSX transformation and test environment polyfills.

- Test scaffolding and mocks
  - Quickly create focused mocks for heavy UI libraries (`antd`) to run unit tests in a headless Node environment, while avoiding rewriting components.

- Documentation and README
  - Generate readable, structured documentation for the repo to speed onboarding and share the architecture decisions.

- Code-review suggestions
  - Use AI to surface likely issues (missing polyfills, moduleNameMapper patterns, common jest pitfalls with Module Federation mocks).

Practical tips when using AI tools
- Treat AI output as a first draft — review and run tests locally to verify.
- Keep changes small and review diffs; prefer incremental edits.
- Use AI to save time on boilerplate, but keep ownership over architectural decisions.

---

## Try it locally

Install and run each package (three terminals):

```bash
# from repo root
cd shared && npm install
cd ../user-dashboard-shell && npm install && npm start
cd ../user-list && npm install && npm start
cd ../user-details && npm install && npm start
```

Open `http://localhost:3000` to use the host app. It will load remotes from ports `3001` and `3002`.

Run tests for a package (example `user-list`):

```bash
cd user-list
npm test
```


## Time Trade-offs Made

### What I prioritized and why

Given the strict 4–6 hour timebox, I focused on delivering:

| Priority | Reason |
|---------|--------|
| Clean simulated micro frontend boundaries | Demonstrate understanding of micro frontend principles |
| Feature completeness | Ensure the evaluator can test core UX flows end-to-end |
| Clear Shell-to-MF communication pattern | Required for scaling to real micro frontends |
| Local persistence | JSONPlaceholder API is read-only |
| Ant Design + user-friendly UX | Professional UI demonstrating component abstraction |
| Code organization & reuse | Reflect scalable enterprise architecture |

Technical focus areas:

- React Context for MF communication
- Lazy loading & code splitting for performance
- Debounced search + pagination to reduce re-renders

---

### 🚀 What I would implement with more time

If time wasn’t limited:

- Use Nx to implement micro frontend architecture.
- Virtualized lists for large datasets
- Authentication boundaries per MF

---

### 🔀 Alternative approaches considered

### 🔀 Alternative approaches considered

| Approach | Pros | Cons | Decision |
|---------|------|------|---------|
| True Module Federation (Nx + multiple apps) | Production-ready micro frontend architecture | Setup complexity and time cost too high for 4–6 hours | ❌ Deferred; documented as future scaling |
| Single SPA without boundaries | Simple implementation | Does not demonstrate micro frontend concepts | ❌ Not aligned with assessment requirements |
| Event bus messaging | Clear MF isolation | Over-engineering for current scope | ❌ Adds unnecessary complexity |
| Redux/Zustand global state | High scalability | More boilerplate & setup cost | ✅ React Context is simpler and sufficient for this scope |
| CSS-in-JS styling | Flexible theming | More configuration effort needed | ✅ AntD + SCSS meets requirements efficiently |
