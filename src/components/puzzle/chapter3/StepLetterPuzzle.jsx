import { useState } from 'react';
import { ClueSuccess } from './MemoryPuzzle.jsx';

const target = ['S', 'T', 'E', 'P'];

export default function StepLetterPuzzle({ clue, lines, onComplete }) {
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('The beginning of each line may know the answer. 每一行的开头，或许知道答案。');
  const [errorIndex, setErrorIndex] = useState(-1);
  const complete = selected.length === target.length;

  const chooseLetter = (letter, index) => {
    if (complete) {
      return;
    }

    if (target[selected.length] !== letter || index !== selected.length) {
      setErrorIndex(index);
      setMessage('从第一行开始，再看看它们的开头');
      window.setTimeout(() => setErrorIndex(-1), 360);
      return;
    }

    const next = [...selected, letter];
    setSelected(next);
    setMessage('Keep reading the first letters.');

    if (next.length === target.length) {
      setMessage('');
      onComplete();
    }
  };

  return (
    <div className="journey-puzzle-panel">
      <p className="journey-puzzle-hint">{message}</p>
      <div className="journey-letter-paper">
        {lines.map((line, index) => {
          const letter = line.charAt(0);

          return (
            <p key={line}>
              <button
                type="button"
                className={`${selected[index] ? 'is-selected' : ''} ${errorIndex === index ? 'is-shaking' : ''}`}
                onClick={() => chooseLetter(letter, index)}
                disabled={complete || Boolean(selected[index])}
              >
                {letter}
              </button>
              {line.slice(1)}
            </p>
          );
        })}
      </div>
      {selected.length ? (
        <div className="journey-step-word" aria-label="Selected STEP letters">
          {selected.map((letter, index) => (
            <span key={`${letter}-${index}`}>{letter}</span>
          ))}
        </div>
      ) : null}
      {complete ? <ClueSuccess clue={clue} /> : null}
    </div>
  );
}
