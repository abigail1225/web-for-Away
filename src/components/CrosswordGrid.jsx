import { cellKey } from '../crosswordPuzzle.js';
import CrosswordCell from './CrosswordCell.jsx';

export default function CrosswordGrid({
  activeCell,
  hiddenCells,
  incorrectCells,
  letters,
  numbering,
  onCellClick,
  onCellKeyDown,
  puzzle,
  solved,
}) {
  return (
    <div
      className="crossword-grid"
      role="grid"
      aria-label="Crossword grid"
      style={{ '--crossword-size': puzzle.grid[0]?.length || 1 }}
    >
      {puzzle.grid.map((row, rowIndex) =>
        row.map((answer, columnIndex) => {
          const key = cellKey(rowIndex, columnIndex);

          return (
            <CrosswordCell
              key={key}
              answer={answer}
              column={columnIndex}
              isActive={activeCell?.row === rowIndex && activeCell?.column === columnIndex}
              isHiddenAnswer={solved && hiddenCells.has(key)}
              isIncorrect={incorrectCells.has(key)}
              number={numbering.get(key)}
              onClick={() => onCellClick(rowIndex, columnIndex)}
              onKeyDown={(event) => onCellKeyDown(event, rowIndex, columnIndex)}
              row={rowIndex}
              value={letters[key] || ''}
            />
          );
        }),
      )}
    </div>
  );
}
