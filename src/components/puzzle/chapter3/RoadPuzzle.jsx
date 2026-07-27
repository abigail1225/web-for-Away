import { useMemo, useState } from 'react';
import { ClueSuccess } from './MemoryPuzzle.jsx';

export default function RoadPuzzle({ clue, onComplete, tiles }) {
  const [rotations, setRotations] = useState(() => tiles.map((tile) => tile.initialRotation));
  const solved = useMemo(
    () => rotations.every((rotation, index) => rotation % 360 === tiles[index].answerRotation),
    [rotations, tiles],
  );

  const rotateTile = (index) => {
    if (solved) {
      return;
    }

    setRotations((current) => {
      const next = current.map((rotation, candidateIndex) =>
        candidateIndex === index ? (rotation + 90) % 360 : rotation,
      );

      if (next.every((rotation, tileIndex) => rotation === tiles[tileIndex].answerRotation)) {
        onComplete();
      }

      return next;
    });
  };

  return (
    <div className={`journey-puzzle-panel ${solved ? 'is-route-solved' : ''}`}>
      <p className="journey-puzzle-hint">点击旋转路线碎片，让小路从 START 连到 GOAL。</p>
      <div className="journey-route-map">
        <div className="journey-route-guide" aria-label="Faint route guide from start to goal">
          <span className="start">START</span>
          <span className="goal">GOAL</span>
          <svg viewBox="0 0 720 260" aria-hidden="true">
            <path d="M72 138 C150 72 230 84 292 138 S430 200 506 136 S620 72 660 126" />
          </svg>
        </div>
        <div className="journey-route" role="group" aria-label="Rotate route tiles">
          {tiles.map((tile, index) => (
            <button
              key={tile.id}
              type="button"
              className={`journey-route-tile route-shape-${index + 1}`}
              aria-label={`Route tile ${index + 1}`}
              onClick={() => rotateTile(index)}
              style={{ '--route-rotation': `${rotations[index]}deg` }}
            >
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <path d={index === 1 ? 'M8 50 H92' : 'M14 82 C28 48 48 30 86 18'} />
                <circle cx={index === 1 ? 50 : 14} cy={index === 1 ? 50 : 82} r="4" />
                <circle cx={index === 1 ? 92 : 86} cy={index === 1 ? 50 : 18} r="4" />
              </svg>
              <span>click to rotate</span>
            </button>
          ))}
        </div>
      </div>
      {solved ? <ClueSuccess clue={clue} /> : null}
    </div>
  );
}
