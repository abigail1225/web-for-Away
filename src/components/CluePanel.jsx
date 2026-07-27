export default function CluePanel({ activeDirection, onSelectWord, words }) {
  const across = words.filter((word) => word.direction === 'across');
  const down = words.filter((word) => word.direction === 'down');

  return (
    <div className="crossword-clues" aria-label="Crossword clues">
      <ClueList
        activeDirection={activeDirection}
        direction="across"
        onSelectWord={onSelectWord}
        title="Across Clues"
        words={across}
      />
      <ClueList
        activeDirection={activeDirection}
        direction="down"
        onSelectWord={onSelectWord}
        title="Down Clues"
        words={down}
      />
    </div>
  );
}

function ClueList({ activeDirection, direction, onSelectWord, title, words }) {
  return (
    <section className={`crossword-clue-list ${activeDirection === direction ? 'is-active' : ''}`}>
      <h4>{title}</h4>
      <ol>
        {words.map((word) => (
          <li key={`${word.direction}-${word.number}`}>
            <button type="button" onClick={() => onSelectWord(word)}>
              <span>{word.number}</span>
              {word.clue}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
