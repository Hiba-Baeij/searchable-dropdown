# Searchable Dropdown Component

A high-performance, reusable searchable dropdown component built with React 19, TypeScript, and Mantine UI.

## Features

- Custom debounce hook implementation
- Paginated API responses with infinite scroll
- Race condition handling for concurrent requests
- Keyboard navigation (arrow keys, enter, escape)
- Text highlighting for matching results
- Optimized performance with React hooks and memoization
- Fully reusable component architecture

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

```tsx
import { SearchableDropdown } from './components/SearchableDropdown';

<SearchableDropdown
  placeholder="Search..."
  onSelect={(item) => console.log(item)}
  minLength={1}
  debounceMs={300}
/>
```
