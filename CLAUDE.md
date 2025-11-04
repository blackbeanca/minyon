# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MINY Dashboard is a React-based web application for artists/creators to track engagement with their MINYON holders (fan token holders). The dashboard enables monitoring of various fan engagement "journeys" including events, music releases, merch drops, fundraisers, virtual events, and festival tickets.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with PostCSS/Autoprefixer
- **Icons**: Lucide React
- **SEO**: React Helmet Async
- **Linting**: ESLint with TypeScript ESLint and React Hooks plugins

## Architecture

### Component Organization

```
src/
├── components/
│   ├── journeys/           # Journey-specific dashboards (events, music, merch, etc.)
│   ├── dashboard/          # Dashboard page components
│   ├── hero/               # Hero/overview section components
│   ├── Layout.tsx          # Main layout with navigation
│   ├── Dashboard.tsx       # Main dashboard page
│   └── [other components]
├── App.tsx                 # Router and route definitions
└── main.tsx               # Application entry point
```

### Journey Types

The application is built around the concept of "journeys" - different types of fan engagement campaigns:
- **Events**: Physical events with RSVPs, location, and song requests
- **Music Teasers/Launch**: Unreleased music engagement tracking
- **Merch Access**: Exclusive merchandise offerings and sales
- **Cause Support**: Fundraising campaigns
- **Virtual Events**: Digital meet & greets
- **Festival Tickets**: Special-priced festival ticket offerings

Each journey has its own dashboard component in `src/components/journeys/` following the pattern `[JourneyType]Dashboard.tsx`.

### Routing Structure

Routes are defined in `App.tsx`:
- `/` - Main dashboard overview
- `/events` - Events dashboard
- `/music` - Music teasers/launch dashboard
- `/merch` - Merchandise dashboard
- `/cause` - Fundraiser dashboard
- `/virtual` - Virtual events dashboard
- `/tickets` - Festival tickets dashboard

Each route includes react-helmet-async `<Helmet>` tags for SEO metadata.

### State Management

Currently uses local React state (useState hooks) within components. No global state management library is implemented. Data is primarily static/mock data defined within components.

### Styling Conventions

- **Primary Color**: Purple (`purple-600`, `purple-50`, etc.)
- **Layout**: Tailwind utility classes throughout
- **Responsive Design**: Mobile-first with breakpoints (sm, md, lg)
- **Card Pattern**: `bg-white rounded-xl shadow-sm p-6` for main containers
- **Navigation**: Fixed top nav for desktop, bottom nav for mobile (< lg breakpoint)

### Navigation System

The `Layout.tsx` component provides:
- Fixed top navigation bar with logo and nav items
- Desktop: Horizontal nav with tooltips
- Mobile: Bottom tab bar (shows first 4 nav items only)
- Profile section with avatar (currently hardcoded to "Sarah Connor")
- Notification and settings buttons

### Component Patterns

1. **Dashboard Components**: Full-page views that compose smaller components
2. **Feature Components**: Self-contained UI blocks (e.g., `TopFans`, `EngagementTimeline`)
3. **Functional Components**: All components use React.FC pattern with TypeScript
4. **Icons**: Imported from `lucide-react` and used inline with consistent sizing

## Development Notes

### Data Layer

Currently, all data is static/mock data defined within components. When implementing a real data layer:
- Consider using React Query or SWR for data fetching
- Mock data objects follow a consistent pattern (see journey dashboards for examples)
- Metrics typically include counts with abbreviated format (e.g., "12.5K")

### Adding New Journeys

To add a new journey type:
1. Create `[JourneyType]Dashboard.tsx` in `src/components/journeys/`
2. Export it from `src/components/journeys/index.ts`
3. Add route in `App.tsx` with appropriate Helmet metadata
4. Add nav item to `navItems` array in `Layout.tsx` with icon and description

### TypeScript Configuration

- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application-specific config (includes src/)
- `tsconfig.node.json` - Vite config file compilation

### Build Configuration

Vite is configured to exclude `lucide-react` from optimizeDeps to prevent build issues.

## Project Created With

This project was scaffolded using Bolt's Vite + React + TypeScript template, as indicated by `.bolt/config.json`.
