<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack & Versions
- **Next.js 16.2.6** (App Router) — breaking changes from v15 and earlier
- **React 19.2.4**
- **Tailwind CSS 4** — config-free by default, different from v3
- **TypeScript 5** — strict mode, `noEmit`, path alias `@/*` → `./src/*`
- **ESLint 9** — flat config (`eslint.config.mjs`)

## Commands
```
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

## Architecture
- App Router entry: `src/app/` (layout.tsx, page.tsx)
- Single-page app so far; no test framework configured
- No CI, no pre-commit hooks
- `.env*` files are gitignored; use standard Next.js env conventions

## Language
- Always respond in Portuguese.
- All code-related content must be in English: code, comments, variable names, commit messages, and technical identifiers.

## Commits
- When asked to commit, group related changes into logical, atomic commits.
- Use Conventional Commit prefixes: `feat`, `fix`, `docs`, `chore`, `test`, `style`, `refactor`, `perf`.
- Keep commit messages short and direct (one line, imperative mood).
- If there are many changes, split them into multiple meaningful commits rather than one large dump.
