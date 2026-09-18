import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const activeCategory = searchParams.get('cat') || 'all';

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!query.trim()) {
            next.delete('q');
          } else {
            next.set('q', query);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setActiveCategory = useCallback(
    (categoryId: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!categoryId || categoryId === 'all') {
            next.delete('cat');
          } else {
            next.set('cat', categoryId);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('q');
        next.delete('cat');
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    clearFilters,
  };
}
