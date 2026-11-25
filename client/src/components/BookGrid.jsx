import { useCallback, useEffect, useMemo, useState } from 'react';
import BookCard from './BookCard.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SKELETON_COUNT = 8;

/**
 * Fetches and renders the filtered, sorted grid of books with loading, error, and empty states.
 */
function BookGrid({
  genreId = '',
  search = '',
  sortBy = 'newest',
  onClearFilters,
  onTotalChange,
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('limit', '50');
      if (genreId) {
        params.set('genreId', String(genreId));
      }
      if (search) {
        params.set('search', search);
      }

      try {
        const response = await fetch(`${API_URL}/books?${params.toString()}`, {
          signal,
        });
        if (!response.ok) {
          throw new Error(`Unable to load catalog (HTTP ${response.status})`);
        }
        const payload = await response.json();
        const list = Array.isArray(payload.data) ? payload.data : [];
        setBooks(list);
        if (onTotalChange) {
          onTotalChange(payload.meta?.total ?? list.length);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load books from the catalog.');
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [genreId, search, onTotalChange],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchBooks(controller.signal);
    return () => controller.abort();
  }, [fetchBooks]);

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    if (sortBy === 'title') {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      copy.sort((a, b) => a.author.localeCompare(b.author));
    }
    return copy;
  }, [books, sortBy]);

  if (loading) {
    return (
      <div className="book-grid" aria-busy="true" aria-label="Loading books">
        {Array.from({ length: SKELETON_COUNT }, (_, idx) => (
          <div key={idx} className="skeleton-card" aria-hidden="true">
            <div className="skeleton-cover" />
            <div className="skeleton-body">
              <div className="skeleton-line short" />
              <div className="skeleton-line title" />
              <div className="skeleton-line author" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel" role="alert">
        <h2 className="state-panel-title">Catalog unavailable</h2>
        <p className="state-panel-message">{error}</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => fetchBooks()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (sortedBooks.length === 0) {
    const hasActiveFilters = Boolean(genreId || search);
    return (
      <div className="state-panel">
        <h2 className="state-panel-title">No matching titles</h2>
        <p className="state-panel-message">
          {hasActiveFilters
            ? 'No books matched your current search or genre selection.'
            : 'There are currently no books in the library catalog.'}
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onClearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="book-grid">
      {sortedBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;
