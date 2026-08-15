export default function ClueProgress({ clues, completedClues }) {
  return (
    <div className="journey-progress" aria-label="Journey clue progress">
      <div>
        <span>Clues Found</span>
        <strong>{completedClues.length} / {clues.length}</strong>
      </div>
      <ol>
        {clues.map((clue) => (
          <li key={clue.id} className={completedClues.includes(clue.id) ? 'is-lit' : ''}>
            {clue.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
