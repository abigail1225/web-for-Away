import { useState } from 'react';
import { ClueSuccess } from './MemoryPuzzle.jsx';

export default function FootprintPuzzle({ clue, onComplete, sequence }) {
  const [placed, setPlaced] = useState([]);
  const [message, setMessage] = useState('走路的时候，左右脚会轮流向前');
  const [bump, setBump] = useState('');
  const complete = placed.length === sequence.length;

  const chooseFoot = (foot) => {
    if (complete) {
      return;
    }

    if (sequence[placed.length] !== foot) {
      setBump(foot);
      setMessage('走路的时候，左右脚会轮流向前');
      window.setTimeout(() => setBump(''), 360);
      return;
    }

    const next = [...placed, foot];
    setPlaced(next);

    if (next.length === sequence.length) {
      setMessage('');
      onComplete();
    }
  };

  return (
    <div className="journey-puzzle-panel">
      <p className="journey-puzzle-hint">{message}</p>
      <div className="journey-footpath">
        <span className="journey-character">YOU</span>
        <div className="journey-path-slots">
          {sequence.map((_, index) => (
            <span key={index} className={placed[index] || ''}>
              {placed[index] ? (placed[index] === 'left' ? 'L' : 'R') : ''}
            </span>
          ))}
        </div>
        <span className="journey-mini-gift">Gift</span>
      </div>
      <div className="journey-foot-options">
        <button
          type="button"
          className={bump === 'left' ? 'is-shaking' : ''}
          onClick={() => chooseFoot('left')}
          disabled={complete}
        >
          Left footprint
        </button>
        <button
          type="button"
          className={bump === 'right' ? 'is-shaking' : ''}
          onClick={() => chooseFoot('right')}
          disabled={complete}
        >
          Right footprint
        </button>
      </div>
      {complete ? <ClueSuccess clue={clue} /> : null}
    </div>
  );
}
