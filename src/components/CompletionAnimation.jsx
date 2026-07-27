export default function CompletionAnimation({ hiddenAnswer, onAdvance, show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="crossword-completion" aria-live="polite">
      <p>You found the hidden message.</p>
      <div className="crossword-hidden-answer">
        <span>Hidden Answer:</span>
        <strong>{hiddenAnswer}</strong>
      </div>
      <h4>Congratulations!</h4>
      <p>You unlocked another piece of my surprise.</p>
      <button type="button" className="btn btn-lavender" onClick={onAdvance}>
        Continue Puzzle Time
      </button>
    </div>
  );
}
