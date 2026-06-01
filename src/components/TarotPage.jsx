import { useMemo, useState } from 'react';

const cards = Array.from({ length: 13 }, (_, index) => index);

export default function TarotPage({ onComplete }) {
  const [hovered, setHovered] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const cardLayout = useMemo(
    () =>
      cards.map((card, index) => {
        const center = (cards.length - 1) / 2;
        const offset = index - center;
        return {
          card,
          rotation: offset * 8,
          x: offset * 42,
          y: Math.abs(offset) * 9,
          delay: `${index * 90}ms`,
        };
      }),
    [],
  );

  const movePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 18,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 18,
    });
  };

  return (
    <main className={`tarot-page ${chosen !== null ? 'tarot-page-chosen' : ''}`} onMouseMove={movePointer}>
      <section className="tarot-intro">
        <p className="tarot-kicker">Before the next secret</p>
        <h1>Pick a card</h1>
        <p>随意抽一张。今天所有运气都会偏向同一个答案。</p>
      </section>

      <section className="tarot-table" aria-label="塔罗牌抽牌区">
        {cardLayout.map((layout, index) => {
          const active = hovered === index || chosen === index;
          return (
            <button
              key={layout.card}
              type="button"
              className={`tarot-card ${active ? 'active' : ''} ${chosen === index ? 'chosen' : ''}`}
              style={{
                '--rot': `${layout.rotation}deg`,
                '--x': `${layout.x + (active && chosen === null ? pointer.x : 0)}px`,
                '--y': `${layout.y + (active && chosen === null ? pointer.y - 18 : 0)}px`,
                '--delay': layout.delay,
              }}
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onClick={() => setChosen(index)}
              aria-label={`抽取第 ${index + 1} 张塔罗牌`}
            >
              <span className="tarot-card-inner">
                <span className="tarot-back">
                  <span className="tarot-back-star">✦</span>
                </span>
                <span className="tarot-front">
                  <span className="angel-card-art" aria-hidden="true">
                    <span className="angel-crown">♕</span>
                    <span className="angel-wings" />
                    <span className="angel-head" />
                    <span className="angel-body" />
                    <span className="angel-arms" />
                  </span>
                  <span className="luckiest">The luckiest</span>
                </span>
              </span>
            </button>
          );
        })}
      </section>

      {chosen !== null ? (
        <div className="tarot-actions">
          <p>命运已经翻面。下一段会变暗，请帮小人走到出口。</p>
          <button type="button" className="btn btn-rose" onClick={onComplete}>
            进入下一段
          </button>
        </div>
      ) : null}
    </main>
  );
}
