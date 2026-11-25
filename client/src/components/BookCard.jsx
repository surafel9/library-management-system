import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders a single book entry in the catalog grid.
 */
function BookCard({ book }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isAvailable = book.availableCopies > 0;
  const showImage = Boolean(book.coverImage) && !imgFailed;

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-card-cover">
        {showImage ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            loading="lazy"
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

      <div className="book-card-body">
        {book.genre?.name && (
          <span className="book-card-genre">{book.genre.name}</span>
        )}
        <h2 className="book-card-title">{book.title}</h2>
        <p className="book-card-author">by {book.author}</p>

        <div className="book-card-footer">
          <span
            className={`availability-badge ${
              isAvailable ? 'is-available' : 'is-unavailable'
            }`}
          >
            {isAvailable
              ? `${book.availableCopies} of ${book.totalCopies} available`
              : 'Checked out'}
          </span>
          <span className="book-card-action" aria-hidden="true">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
