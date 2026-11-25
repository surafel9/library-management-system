import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Displays full details for a single book fetched by route ID.
 */
function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  const fetchBook = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      setImgFailed(false);

      try {
        const response = await fetch(`${API_URL}/books/${id}`, { signal });
        if (response.status === 404) {
          throw new Error('This book could not be found in the catalog.');
        }
        if (!response.ok) {
          throw new Error(
            `Unable to load book details (HTTP ${response.status})`,
          );
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load book details.');
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchBook(controller.signal);
    return () => controller.abort();
  }, [fetchBook]);

  if (loading) {
    return (
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="back-link">
            &larr; Back to catalog
          </Link>
        </nav>
        <div
          className="detail-layout"
          aria-busy="true"
          aria-label="Loading book"
        >
          <div className="detail-cover-wrap skeleton-cover" />
          <div className="detail-info">
            <div className="skeleton-line short" />
            <div className="skeleton-line title" />
            <div className="skeleton-line author" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="back-link">
            &larr; Back to catalog
          </Link>
        </nav>
        <div className="state-panel" role="alert">
          <h1 className="state-panel-title">Book not available</h1>
          <p className="state-panel-message">
            {error || 'The requested book could not be loaded.'}
          </p>
          <div
            style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}
          >
            <Link to="/" className="btn-secondary">
              Return to catalog
            </Link>
            <button
              type="button"
              className="btn-primary"
              onClick={() => fetchBook()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const showImage = Boolean(book.coverImage) && !imgFailed;

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="back-link">
          &larr; Back to catalog
        </Link>
      </nav>

      <article className="detail-layout">
        <div className="detail-cover-wrap">
          {showImage ? (
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="book-cover-plate" aria-hidden="true">
              <span className="book-cover-plate-genre">
                {book.genre?.name ?? 'Catalog'}
              </span>
              <span className="book-cover-plate-title">{book.title}</span>
              <span className="book-cover-plate-author">{book.author}</span>
            </div>
          )}
        </div>

        <div className="detail-info">
          {book.genre?.name && (
            <span className="detail-genre-tag">{book.genre.name}</span>
          )}
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">by {book.author}</p>

          <div>
            <span
              className={`availability-badge ${
                isAvailable ? 'is-available' : 'is-unavailable'
              }`}
            >
              {isAvailable
                ? `Available — ${book.availableCopies} of ${book.totalCopies} copies on shelf`
                : 'Currently checked out'}
            </span>
          </div>

          <p className="detail-description">
            {book.description ||
              'No synopsis is currently available for this edition.'}
          </p>

          <dl className="detail-meta-grid">
            <div className="detail-meta-cell">
              <dt className="detail-meta-label">ISBN</dt>
              <dd className="detail-meta-value mono" style={{ margin: 0 }}>
                {book.isbn}
              </dd>
            </div>
            <div className="detail-meta-cell">
              <dt className="detail-meta-label">Available Copies</dt>
              <dd className="detail-meta-value" style={{ margin: 0 }}>
                {book.availableCopies} / {book.totalCopies}
              </dd>
            </div>
            <div className="detail-meta-cell">
              <dt className="detail-meta-label">Genre</dt>
              <dd className="detail-meta-value" style={{ margin: 0 }}>
                {book.genre?.name ?? 'Uncategorized'}
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}

export default BookDetail;
