import { useEffect, useRef, useState } from 'react';
import {
  createStartingRotations,
  isPuzzleSolved,
  rotateTileLeft,
} from '../puzzleRotation.js';

const GRID_SIZE = 3;
const STATUS_TEXT = '继续旋转拼好花束';
const SOLVED_TEXT = '拼好了！';

export default function BouquetRotationPuzzle({
  imageSrc,
  onSolved,
  onAdvance,
  createInitialRotations = createStartingRotations,
}) {
  const [rotations, setRotations] = useState(() => createInitialRotations());
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const hasReportedSolved = useRef(false);
  const hasAdvancedRef = useRef(false);
  const solved = isPuzzleSolved(rotations);

  useEffect(() => {
    if (!solved || hasReportedSolved.current) {
      return;
    }

    hasReportedSolved.current = true;
    onSolved?.();
  }, [solved, onSolved]);

  const handleRotate = (index) => {
    if (solved) {
      return;
    }

    setRotations((current) => rotateTileLeft(current, index));
  };

  const handleAdvance = () => {
    if (!solved || hasAdvancedRef.current) {
      return;
    }

    hasAdvancedRef.current = true;
    setHasAdvanced(true);
    onAdvance?.();
  };

  return (
    <section className={`bouquet-puzzle${solved ? ' is-solved' : ''}`}>
      <p className="bouquet-puzzle-status" aria-live="polite">
        {solved ? SOLVED_TEXT : STATUS_TEXT}
      </p>

      <div className="bouquet-puzzle-frame">
        <div
          className="bouquet-puzzle-grid"
          role="group"
          aria-label="3乘3生日花束旋转拼图"
        >
          {rotations.map((rotation, index) => {
            const row = Math.floor(index / GRID_SIZE);
            const column = index % GRID_SIZE;

            return (
              <button
                key={index}
                type="button"
                className="bouquet-puzzle-tile"
                aria-label={`第${row + 1}行第${column + 1}列，向左旋转 90 度`}
                disabled={solved}
                onClick={() => handleRotate(index)}
              >
                <span
                  aria-hidden="true"
                  className="bouquet-puzzle-image"
                  style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundPosition: `${column * 50}% ${row * 50}%`,
                    transform: `rotate(${rotation * 90}deg)`,
                  }}
                />
              </button>
            );
          })}
        </div>

        {solved ? (
          <button
            type="button"
            className="bouquet-puzzle-advance"
            aria-label="拼好了，进入下一关"
            disabled={hasAdvanced}
            onClick={handleAdvance}
          >
            <span>进入下一关</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
