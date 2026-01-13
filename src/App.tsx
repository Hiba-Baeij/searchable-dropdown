import { useState, lazy, Suspense } from 'react';
import { Container, Loader } from '@mantine/core';
import { Header } from './components/Header';
import { SearchSectionManual } from './components/SearchSectionManual';
import { SearchSectionMantine } from './components/SearchSectionMantine';
import { SelectedItemCard } from './components/SelectedItemCard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SearchResult } from './types';


const KeyboardShortcuts = lazy(() =>
  import('./components/KeyboardShortcuts').then((module) => ({
    default: module.KeyboardShortcuts,
  }))
);


function App() {
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  const handleSelect = (item: SearchResult) => {
    setSelectedItem(item);
    console.log('Selected:', item);
  };

  return (
    <ErrorBoundary>
      <Container size="lg" py="xl">
        <Header />

        <SearchSectionManual onSelect={handleSelect} />
        <SearchSectionMantine onSelect={handleSelect} />

        <SelectedItemCard item={selectedItem} />

        <Suspense fallback={<Loader />}>
          <KeyboardShortcuts />
        </Suspense>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
