## ADDED Requirements

### Requirement: Tailwind CSS 4 Configuration
The project SHALL use Tailwind CSS 4 with:
- Zero-config default setup (no `tailwind.config.js` required)
- CSS-first configuration via `@theme` directive in `globals.css`
- Content auto-detection for Next.js App Router

#### Scenario: Use Tailwind utility classes
- **WHEN** developer adds `className="bg-blue-500 text-white p-4"`
- **THEN** styles are applied correctly at runtime

### Requirement: shadcn/ui Component Library
The project SHALL integrate shadcn/ui with:
- Components installed via CLI (`npx shadcn@latest add <component>`)
- Components stored in `src/components/ui/`
- Radix UI primitives as the base for accessibility

#### Scenario: Install shadcn/ui component
- **WHEN** developer runs `npx shadcn@latest add button`
- **THEN** Button component is added to `src/components/ui/button.tsx`

### Requirement: Base UI Components
The following base components SHALL be installed initially:
- Button
- Input
- Card
- Dialog
- Dropdown Menu
- Avatar
- Badge
- Skeleton (loading states)

#### Scenario: Use base component
- **WHEN** developer imports `@/components/ui/button`
- **THEN** Button component is available with default shadcn/ui styling

### Requirement: Design Tokens
The project SHALL define design tokens via Tailwind CSS 4 `@theme`:
- Color palette (primary, secondary, accent, destructive, muted)
- Typography scale (font sizes, weights)
- Spacing scale
- Border radius values
- Shadow levels

#### Scenario: Use design token
- **WHEN** developer uses `bg-primary` or `text-muted-foreground`
- **THEN** consistent design token values are applied

### Requirement: Dark Mode Support
The UI SHALL support dark mode with:
- `next-themes` for theme switching
- System preference detection
- Manual toggle via UI component

#### Scenario: Switch to dark mode
- **WHEN** user toggles theme to dark
- **THEN** all components adapt to dark color tokens
