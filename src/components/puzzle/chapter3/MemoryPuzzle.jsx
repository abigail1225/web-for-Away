import { useState } from 'react';
import ImageWithFallback from './ImageWithFallback.jsx';

export default function MemoryPuzzle({ clue, onComplete, photos }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState('Click the photos from earliest to latest.');
  const [shakeId, setShakeId] = useState('');
  const [complete, setComplete] = useState(false);

  const orderedIds = photos
    .slice()
    .sort((left, right) => left.date.localeCompare(right.date))
    .map((photo) => photo.id);

  const choosePhoto = (photo) => {
    if (complete || selectedIds.includes(photo.id)) {
      return;
    }

    if (orderedIds[selectedIds.length] !== photo.id) {
      setShakeId(photo.id);
      setMessage('好像不是这个顺序，再看看日期');
      window.setTimeout(() => setShakeId(''), 380);
      return;
    }

    const nextSelected = [...selectedIds, photo.id];
    setSelectedIds(nextSelected);
    setMessage('Good. Keep following the dates.');

    if (nextSelected.length === orderedIds.length) {
      setComplete(true);
      setMessage('');
      onComplete();
    }
  };

  return (
    <div className="journey-puzzle-panel">
      <p className="journey-puzzle-hint">{message}</p>
      <div className="journey-memory-grid">
        {photos.map((photo) => (
          <button
            type="button"
            key={photo.id}
            className={`journey-memory-card ${selectedIds.includes(photo.id) ? 'is-selected' : ''} ${
              shakeId === photo.id ? 'is-shaking' : ''
            }`}
            onClick={() => choosePhoto(photo)}
            disabled={complete || selectedIds.includes(photo.id)}
          >
            <ImageWithFallback src={photo.image} alt={photo.title} />
            <strong>{photo.date}</strong>
            <span>{photo.title}</span>
          </button>
        ))}
      </div>
      {complete ? <ClueSuccess clue={clue} /> : null}
    </div>
  );
}

export function ClueSuccess({ clue }) {
  return (
    <div className="journey-clue-success" aria-live="polite">
      <h5>{clue.successTitle}</h5>
      <p>{clue.successText}</p>
      <p>{clue.successTextCn}</p>
    </div>
  );
}
