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
      <p className="journey-puzzle-hint">Rotate the path from START to GOAL.</p>
      <div className="journey-route" role="group" aria-label="Rotate route tiles">
        <span>START</span>
        {tiles.map((tile, index) => (
          <button
            key={tile.id}
            type="button"
            className="journey-route-tile"
            aria-label={`Route tile ${index + 1}`}
            onClick={() => rotateTile(index)}
            style={{ '--route-rotation': `${rotations[index]}deg` }}
          >
            <span />
          </button>
        ))}
        <span>GOAL</span>
      </div>
      {solved ? <ClueSuccess clue={clue} /> : null}
    </div>
  );
}
