import ImageWithFallback from './ImageWithFallback.jsx';

export default function GiftBoxReveal({
  assets,
  claimOpen,
  claimed,
  finalMessage,
  onAdvance,
  onClaim,
  onConfirmClaim,
}) {
  return (
    <section className="journey-reveal" aria-live="polite">
      <div className="journey-reveal-art">
        <ImageWithFallback src={assets.shoes} alt="Shoes gift" />
      </div>
      <div>
        <h4>{claimed ? finalMessage.completedTitle : finalMessage.title}</h4>
        {!claimed ? (
          <>
            {finalMessage.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <button type="button" className="btn btn-rose" onClick={onClaim}>
              {finalMessage.claimButton}
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-lavender" onClick={onAdvance}>
            Continue
          </button>
        )}
      </div>

      {claimOpen ? <GiftClaimOverlay finalMessage={finalMessage} onConfirm={onConfirmClaim} /> : null}
    </section>
  );
}

function GiftClaimOverlay({ finalMessage, onConfirm }) {
  return (
    <div className="journey-modal-backdrop">
      <section className="journey-claim-card" role="dialog" aria-modal="true">
        <p>{finalMessage.claimTitle}</p>
        <button type="button" className="btn btn-lavender" onClick={onConfirm}>
          {finalMessage.confirmButton}
        </button>
      </section>
    </div>
  );
}
