# ORCA Financing App

A mobile personal finance app built with a **Design-First** approach: the design system was created in Figma before writing a single line of code. Available as an installable PWA on iOS and Android.

🔗 **Live demo:** https://orca-financing.vercel.app

---

## Tech Stack

### React
Main library for building the UI. The entire app is organized into reusable components and independent pages. Hooks used include `useState`, `useEffect`, `useRef`, `useContext`, and `useNavigate`.

**Example:** `src/components/ui/TransactionCard.jsx` — component with swipe-to-delete and exit animation.

---

### Vite
Build tool and development server. Enables Hot Module Replacement (HMR) in development and generates an optimized production bundle.

**Example:** `vite.config.js` — project configuration with React, Tailwind, and PWA plugins.

---

### Tailwind CSS v4
Utility-first CSS framework. The new `@theme` syntax was used to define all design tokens (colors, typography, spacing) as native CSS variables, allowing the Figma design system to translate 1:1 into code.

**Example:** `src/index.css` — `@theme` block containing all design system tokens.

---

### Framer Motion
Animation library for React. Used for page transitions with `AnimatePresence`, and for the swipe-to-delete gesture on transaction cards with `drag="x"`, `useMotionValue`, and `useTransform`.

**Example:** `src/components/ui/TransactionCard.jsx` — full swipe implementation with drag constraints and exit animation.

---

### Supabase
Backend as a Service used for authentication and database. Handles user registration and login with Row Level Security (RLS) so each user only accesses their own data. Transactions are synced in real time using `postgres_changes`.

**Example:** `src/lib/supabase.js` — client initialization. `src/context/AuthContext.jsx` — session management. `src/context/TransactionContext.jsx` — transactions CRUD.

---

### React Router DOM v6
Client-side navigation with protected routes. App pages are only accessible with an active session; otherwise they redirect to the login page.

**Example:** `src/App.jsx` — `ProtectedRoute` and `PublicRoute` implementation.

---

### Recharts
Chart library built on top of D3. Used to visualize the user's weekly and monthly spending with interactive bar charts.

**Example:** `src/components/charts/SpendingBarChart.jsx`

---

### React Context API
Global state pattern for sharing data across components without prop drilling. The project has three independent contexts that wrap the entire app.

**Example:** `src/context/ThemeContext.jsx` (light/dark theme), `src/context/AuthContext.jsx` (session), `src/context/TransactionContext.jsx` (transactions and budgets).

---

### vite-plugin-pwa
Plugin that converts the app into a Progressive Web App. Automatically generates the `manifest.json` and a Workbox-powered service worker for asset caching, allowing the app to be installed on iOS and Android home screens without going through an app store.

**Example:** `vite.config.js` — plugin configuration with manifest, icons, and auto-update strategy.

---

### Vercel
Deployment platform. The app deploys automatically with every push to the repository. Supabase environment variables are configured directly in the Vercel dashboard to keep them out of the codebase.

**Live:** https://orca-financing.vercel.app

---

## Environment Variables

Create a `.env.local` file at the project root with:

VITE_SUPABASE_URL = https://wmrlpvpyumeynkgyaxjl.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtcmxwdnB5dW1leW5rZ3lheGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjkyOTUsImV4cCI6MjA5MTYwNTI5NX0.bzu7baNihOcPO5NZKxSR24YNC2JKqVg6I4cvVXb2mCo
