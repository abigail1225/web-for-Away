import { useEffect } from 'react';

export default function PuzzleModal({ children, onClose, title }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="journey-modal-backdrop" role="presentation">
      <section className="journey-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="journey-modal-heading">
          <h4>{title}</h4>
          <button type="button" onClick={onClose} aria-label="Close clue">
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
