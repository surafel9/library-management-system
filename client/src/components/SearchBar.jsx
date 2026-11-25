import { useEffect, useRef, useState } from 'react';

/**
 * Debounced live search input for filtering books by title or author.
 */
function SearchBar({ value = '', onSearch, delay = 300 }) {
  const [inputValue, setInputValue] = useState(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timerId = setTimeout(() => {
      onSearch(inputValue.trim());
    }, delay);

    return () => clearTimeout(timerId);
  }, [inputValue, delay, onSearch]);

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="search"
        className="search-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by title or author..."
        aria-label="Search books by title or author"
      />
      {inputValue && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default SearchBar;
