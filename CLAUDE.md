# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application called "liftingdiarycourse" built with the App Router, React 19, TypeScript, and Tailwind CSS 4. The project uses the newer Tailwind CSS PostCSS integration and Clerk for authentication.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Opens the app at http://localhost:3000 with hot reloading.

### Build for Production
```bash
npm build
```

### Start Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```
Uses ESLint with Next.js recommended configs for both core web vitals and TypeScript.

## Architecture

### Next.js App Router Structure
- Uses App Router (not Pages Router) with the `app/` directory
- **[app/layout.tsx](app/layout.tsx)**: Root layout with Geist font configuration (Geist Sans and Geist Mono)
- **[app/page.tsx](app/page.tsx)**: Homepage component
- **[app/globals.css](app/globals.css)**: Global styles with Tailwind CSS 4 import syntax

### Styling
- **Tailwind CSS 4**: Uses new `@import "tailwindcss"` syntax instead of `@tailwind` directives
- **PostCSS Plugin**: Uses `@tailwindcss/postcss` (not standalone Tailwind config)
- **CSS Custom Properties**: Theme variables defined in `globals.css` using `@theme inline`
- **Dark Mode**: Configured via `prefers-color-scheme` media query
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`

### TypeScript Configuration
- **Path Alias**: `@/*` maps to project root (e.g., `@/app/page.tsx`)
- **Target**: ES2017
- **Module Resolution**: bundler
- **JSX**: react-jsx (automatic runtime)
- **Strict Mode**: enabled

### ESLint Configuration
- Uses flat config format (`eslint.config.mjs`)
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores `.next/`, `out/`, `build/`, and `next-env.d.ts`

### Authentication with Clerk

This project uses **Clerk** (`@clerk/nextjs`) for authentication. Follow these critical guidelines:

#### Correct Implementation (App Router)

**Middleware** (`middleware.ts`):
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**Layout** (`app/layout.tsx`):
- Wrap app with `<ClerkProvider>` from `@clerk/nextjs`
- Use components: `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>`

**Server-side auth**:
- Import `auth()` from `@clerk/nextjs/server` (always use `async/await`)

**Environment Variables** (`.env.local`):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

#### Critical Rules

**ALWAYS:**
- Use `clerkMiddleware()` from `@clerk/nextjs/server` in `middleware.ts`
- Import from `@clerk/nextjs` or `@clerk/nextjs/server` only
- Store keys in `.env.local` (ensure `.gitignore` excludes `.env*`)
- Use placeholders in code examples (never real keys)

**NEVER:**
- Use deprecated `authMiddleware()` (replaced by `clerkMiddleware()`)
- Reference Pages Router patterns (`_app.tsx`, `pages/signin.js`)
- Import from deprecated APIs (`withAuth`, old `currentUser`)
- Write real keys to tracked files

## File Organization

Current structure is a fresh Next.js scaffold. Future development will likely add:
- `/app/api/` for API routes
- `/components/` for reusable React components
- `/lib/` for utility functions and shared logic
- `/types/` for TypeScript type definitions
- `middleware.ts` for Clerk authentication middleware
