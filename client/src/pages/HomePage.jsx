import { useCallback, useEffect, useState } from 'react';
import BookGrid from '../components/BookGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Patron-facing catalog landing page with shared search, genre, and sort state.
 */
function HomePage() {
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [totalBooks, setTotalBooks] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGenres() {
      try {
        const res = await fetch(`${API_URL}/genres`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setGenres(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setGenres([]);
        }
      }
    }

    loadGenres();
    return () => controller.abort();
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedGenreId('');
    setSearchQuery('');
    setSortBy('newest');
  }, []);

  return (
    <div className="container">
      <section className="catalog-intro">
        <div>
          <h1 className="catalog-title">Library Catalog</h1>
          <p className="catalog-description">
            Browse our lending collection by genre or search directly by title
            and author.
          </p>
        </div>
        {totalBooks !== null && (
          <span className="catalog-count">
            {totalBooks} {totalBooks === 1 ? 'volume' : 'volumes'}
          </span>
        )}
      </section>

      <section className="controls-bar" aria-label="Catalog filters">
        <div className="controls-top-row">
          <SearchBar value={searchQuery} onSearch={handleSearch} />
          <div className="sort-control">
            <label htmlFor="sort-books" className="sort-label">
              Sort
            </label>
            <select
              id="sort-books"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Recently Added</option>
              <option value="title">Title (A–Z)</option>
              <option value="author">Author (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="genre-filter" role="group" aria-label="Filter by genre">
          <button
            type="button"
            className="genre-pill"
            aria-pressed={selectedGenreId === ''}
            onClick={() => setSelectedGenreId('')}
          >
            All Genres
          </button>
          {genres.map((genre) => {
            const isSelected = String(selectedGenreId) === String(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                className="genre-pill"
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedGenreId(isSelected ? '' : String(genre.id))
                }
              >
                <span>{genre.name}</span>
                {genre._count?.books !== undefined && (
                  <span className="genre-pill-count">{genre._count.books}</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <BookGrid
        genreId={selectedGenreId}
        search={searchQuery}
        sortBy={sortBy}
        onClearFilters={handleClearFilters}
        onTotalChange={setTotalBooks}
      />
    </div>
  );
}

export default HomePage;
