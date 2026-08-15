import { useEffect, useMemo, useRef, useState } from 'react';
import {
  cellKey,
  checkCrosswordAnswers,
  getHiddenAnswer,
  isPlayableCell,
  normalizeCrosswordInput,
} from '../crosswordPuzzle.js';
import CluePanel from './CluePanel.jsx';
import CompletionAnimation from './CompletionAnimation.jsx';
import CrosswordGrid from './CrosswordGrid.jsx';

const directions = {
  across: { row: 0, column: 1 },
  down: { row: 1, column: 0 },
};

function buildNumbering(words) {
  return new Map(words.map((word) => [cellKey(word.start.row, word.start.column), word.number]));
}

function findWordsAtCell(words, row, column) {
  return words.filter((word) => {
    const rowDelta = word.direction === 'down' ? 1 : 0;
    const columnDelta = word.direction === 'across' ? 1 : 0;

    return Array.from({ length: word.answer.length }).some((_, index) => {
      return word.start.row + rowDelta * index === row && word.start.column + columnDelta * index === column;
    });
  });
}

function findWordAtCell(words, row, column, preferredDirection) {
  const candidates = findWordsAtCell(words, row, column);

  return candidates.find((word) => word.direction === preferredDirection) || candidates[0];
}

export default function CrosswordPuzzle({ data, onSolved, onAdvance }) {
  const [letters, setLetters] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [activeDirection, setActiveDirection] = useState('across');
  const [incorrectCells, setIncorrectCells] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);

  const hiddenAnswer = useMemo(() => getHiddenAnswer(data), [data]);
  const hiddenAnswerDisplay = data.hiddenAnswerLabel || hiddenAnswer;
  const hiddenCells = useMemo(
    () => new Set(data.hiddenAnswerCells.map(({ row, column }) => cellKey(row, column))),
    [data],
  );
  const numbering = useMemo(() => buildNumbering(data.words), [data.words]);

  useEffect(() => {
    if (activeCell) {
      const selector = `[data-cell-key="${cellKey(activeCell.row, activeCell.column)}"]`;
      document.querySelector(selector)?.focus();
    }
  }, [activeCell]);

  const moveTo = (row, column, direction = activeDirection, reverse = false) => {
    const step = directions[direction];
    const directionMultiplier = reverse ? -1 : 1;
    const nextRow = row + step.row * directionMultiplier;
    const nextColumn = column + step.column * directionMultiplier;

    if (isPlayableCell(data, nextRow, nextColumn)) {
      setActiveCell({ row: nextRow, column: nextColumn });
    }
  };

  const selectCell = (row, column) => {
    if (!isPlayableCell(data, row, column) || solved) {
      return;
    }

    const wordsAtCell = findWordsAtCell(data.words, row, column);
    const currentWord = wordsAtCell.find((word) => word.direction === activeDirection) || wordsAtCell[0];
    const hasAcross = wordsAtCell.some((word) => word.direction === 'across');
    const hasDown = wordsAtCell.some((word) => word.direction === 'down');
    const nextDirection =
      activeCell?.row === row && activeCell?.column === column && hasAcross && hasDown
        ? activeDirection === 'across'
          ? 'down'
          : 'across'
        : currentWord?.direction || activeDirection;

    setActiveDirection(nextDirection);
    setActiveCell({ row, column });
  };

  const selectWord = (word) => {
    if (solved) {
      return;
    }

    setActiveDirection(word.direction);
    setActiveCell(word.start);
  };

  const updateLetter = (row, column, value) => {
    const key = cellKey(row, column);

    setLetters((current) => ({ ...current, [key]: value }));
    setIncorrectCells((current) => {
      if (!current.has(key)) {
        return current;
      }

      const next = new Set(current);
      next.delete(key);
      return next;
    });
  };

  const handleKeyDown = (event, row, column) => {
    if (solved) {
      return;
    }

    const typed = normalizeCrosswordInput(event.key);

    if (typed) {
      event.preventDefault();
      updateLetter(row, column, typed);
      moveTo(row, column);
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      updateLetter(row, column, '');
      moveTo(row, column, activeDirection, true);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveDirection('across');
      moveTo(row, column, 'across');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveDirection('across');
      moveTo(row, column, 'across', true);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveDirection('down');
      moveTo(row, column, 'down');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveDirection('down');
      moveTo(row, column, 'down', true);
    }
  };

  const checkAnswer = () => {
    const result = checkCrosswordAnswers(data, letters);
    setIncorrectCells(new Set(result.incorrectCells));

    if (!result.solved) {
      setMessage('Almost there! Keep looking.');
      return;
    }

    setMessage('');
    setSolved(true);

    if (!solvedRef.current) {
      solvedRef.current = true;
      onSolved?.();
    }
  };

  return (
    <div className={`crossword-puzzle ${solved ? 'is-solved' : ''}`}>
      <header className="crossword-header">
        <p>Puzzle Time · Chapter 2</p>
        <h3>{data.title}</h3>
        <span>{data.intro}</span>
      </header>

      <div className="crossword-layout">
        <CrosswordGrid
          activeCell={activeCell}
          hiddenCells={hiddenCells}
          incorrectCells={incorrectCells}
          letters={letters}
          numbering={numbering}
          onCellClick={selectCell}
          onCellKeyDown={handleKeyDown}
          puzzle={data}
          solved={solved}
        />
        <CluePanel activeDirection={activeDirection} onSelectWord={selectWord} words={data.words} />
      </div>

      <div className="crossword-actions">
        <button type="button" className="btn btn-rose" onClick={checkAnswer} disabled={solved}>
          Check Answer
        </button>
        {message ? <span>{message}</span> : null}
      </div>

      <CompletionAnimation hiddenAnswer={hiddenAnswerDisplay} onAdvance={onAdvance} show={solved} />
    </div>
  );
}
