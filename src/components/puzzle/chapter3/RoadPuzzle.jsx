import { useMemo, useState } from 'react';
import { ClueSuccess } from './MemoryPuzzle.jsx';

export default function RoadPuzzle({ clue, onComplete, tiles }) {
  const [rotations, setRotations] = useState(() => tiles.map((tile) => tile.initialRotation));
  const tileStates = useMemo(
    () =>
      rotations.map((rotation, index) => {
        const answerRotation = tiles[index].answerRotation % 360;
        const turnsRemaining = ((answerRotation - rotation + 360) % 360) / 90;

        return { isCorrect: turnsRemaining === 0, turnsRemaining };
      }),
    [rotations, tiles],
  );
  const solved = tileStates.every((tile) => tile.isCorrect);

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
        <p className="journey-route-goal">正确方向：红点在左，金点在右。完成后会自动解锁。</p>
        <div className="journey-route-guide" aria-label="Faint route guide from start to goal">
          <span className="start">START</span>
          <span className="goal">GOAL</span>
          <svg viewBox="0 0 720 260" aria-hidden="true">
            <path d="M72 132 H648" />
          </svg>
        </div>
        <div className="journey-route" role="group" aria-label="Rotate route tiles">
          {tiles.map((tile, index) => {
            const tileState = tileStates[index];
            const status = tileState.isCorrect
              ? '方向正确'
              : `还需再点 ${tileState.turnsRemaining} 次`;

            return (
              <button
                key={tile.id}
                type="button"
                className={`journey-route-tile route-shape-${index + 1} ${
                  tileState.isCorrect ? 'is-correct' : ''
                }`}
                aria-label={`Route tile ${index + 1}: ${status}`}
                onClick={() => rotateTile(index)}
                style={{ '--route-rotation': `${rotations[index]}deg` }}
              >
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <path d="M8 50 H92" />
                  <circle className="route-entry" cx="8" cy="50" r="5" />
                  <circle className="route-exit" cx="92" cy="50" r="5" />
                </svg>
                <span className="journey-route-tile-status">{status}</span>
              </button>
            );
          })}
        </div>
      </div>
      {solved ? <ClueSuccess clue={clue} /> : null}
    </div>
  );
}
