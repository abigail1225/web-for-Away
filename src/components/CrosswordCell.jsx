import { cellKey } from '../crosswordPuzzle.js';

export default function CrosswordCell({
  answer,
  column,
  isActive,
  isHiddenAnswer,
  isIncorrect,
  number,
  onClick,
  onKeyDown,
  row,
  value,
}) {
  if (answer === '#') {
    return <div className="crossword-cell crossword-cell-black" role="presentation" />;
  }

  return (
    <button
      type="button"
      className={`crossword-cell crossword-cell-input ${isActive ? 'is-active' : ''} ${
        isIncorrect ? 'is-incorrect' : ''
      } ${isHiddenAnswer ? 'is-hidden-answer' : ''}`}
      data-cell-key={cellKey(row, column)}
      aria-label={`Row ${row + 1} column ${column + 1}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="gridcell"
    >
      {number ? <span className="crossword-cell-number">{number}</span> : null}
      <span className="crossword-cell-letter">{value}</span>
    </button>
  );
}
