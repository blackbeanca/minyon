# Frontend Development Guidelines

## Purpose
This skill provides modern React/TypeScript development patterns and best practices for building maintainable, performant frontend applications.

## When to Use This Skill
- Creating or modifying React components
- Implementing new features in the frontend
- Refactoring component structure
- Setting up routing or data fetching
- Working with TypeScript types
- Styling components

## Core Principles

### 1. Component Structure
- Use functional components with TypeScript
- Leverage React hooks for state and side effects
- Keep components focused on a single responsibility
- Prefer composition over inheritance

### 2. TypeScript Best Practices
- Always define explicit types for props and state
- Use interfaces for object shapes
- Avoid `any` - use `unknown` when type is truly unknown
- Leverage union types and type guards

### 3. Project Organization
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, etc.)
│   └── layout/         # Layout components (Header, Footer, etc.)
├── features/           # Feature-specific code
│   └── [feature]/
│       ├── components/ # Feature-specific components
│       ├── hooks/      # Feature-specific hooks
│       └── types/      # Feature-specific types
├── hooks/              # Shared custom hooks
├── types/              # Shared TypeScript types
└── utils/              # Utility functions
```

### 4. Styling Guidelines
- Use Tailwind CSS for utility-first styling
- Keep styles close to components
- Use semantic class names
- Ensure responsive design (mobile-first approach)

### 5. Performance Optimization
- Use React.memo() for expensive component re-renders
- Implement code splitting with React.lazy()
- Optimize images and assets
- Avoid unnecessary re-renders with useMemo and useCallback

## Component Pattern Examples

### Basic Functional Component
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${
        variant === 'primary'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800'
      }`}
    >
      {label}
    </button>
  );
};
```

### Custom Hook Pattern
```tsx
import { useState, useEffect } from 'react';

interface UseDataFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDataFetch<T>(url: string): UseDataFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

## State Management
- Use local component state for UI-only state
- Use Context API for shared state across components
- Consider external state management (Zustand, Redux) for complex global state

## Data Fetching
- Implement proper loading states
- Handle errors gracefully with user-friendly messages
- Use loading indicators for better UX
- Consider caching strategies for frequently accessed data

## Testing Considerations
- Write tests for critical user flows
- Test component behavior, not implementation details
- Mock external dependencies
- Use React Testing Library best practices

## Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Common Patterns to Avoid
❌ Mutating state directly
❌ Using index as key in lists (unless items are static)
❌ Forgetting to cleanup effects
❌ Prop drilling through many levels
❌ Large components doing too much

## Checklist for New Components
- [ ] TypeScript types defined for all props
- [ ] Responsive design implemented
- [ ] Loading and error states handled
- [ ] Accessibility considerations addressed
- [ ] Performance optimizations applied if needed
- [ ] Consistent with project styling patterns

## Related Resources
- React Documentation: https://react.dev
- TypeScript Documentation: https://www.typescriptlang.org/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs

## Notes
This skill enforces consistency and best practices across the frontend codebase. Always refer to these guidelines when working on React components to maintain code quality and maintainability.
