import ImageWithFallback from './ImageWithFallback.jsx';

export default function RoomScene({ activeClue, assets, clues, completedClues, giftOpen, onOpenClue }) {
  const sceneItems = [
    { id: 'memory', className: 'album', asset: assets.album },
    { id: 'road', className: 'map', asset: assets.map },
    { id: 'step', className: 'letter', asset: assets.letter },
    { id: 'shoe', className: 'footprints', asset: assets.footprints },
  ];

  return (
    <div className="journey-room" aria-label="Warm room with a locked surprise box">
      <div className="journey-wall" />
      <div className="journey-floor" />
      <div className={`journey-gift ${giftOpen ? 'is-open' : ''}`}>
        <ImageWithFallback src={giftOpen ? assets.shoes : assets.giftBox} alt={giftOpen ? 'A pair of shoes' : 'Locked surprise box'} />
        <div className="journey-gift-marks" aria-label="Surprise box clue marks">
          {clues.map((clue) => (
            <span key={clue.id} className={completedClues.includes(clue.id) ? 'is-lit' : ''}>
              {clue.label}
            </span>
          ))}
        </div>
      </div>

      {sceneItems.map((item) => {
        const clue = clues.find((candidate) => candidate.id === item.id);
        const completed = completedClues.includes(item.id);
        const unlocked = completed || activeClue === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`journey-hotspot ${item.className} ${unlocked ? 'is-unlocked' : 'is-locked'} ${
              completed ? 'is-complete' : ''
            }`}
            onClick={() => onOpenClue(item.id)}
            disabled={!unlocked || completed}
            aria-label={`${clue.title}${unlocked ? '' : ' locked'}`}
            title={unlocked ? clue.title : '还需要先找到前面的线索'}
          >
            <ImageWithFallback src={item.asset} alt={clue.title} />
            <span>{clue.label}</span>
          </button>
        );
      })}
    </div>
  );
}
