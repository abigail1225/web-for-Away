import { useMemo, useState } from 'react';

const tarotDeck = [
  { id: 'sun', name: '太阳牌', english: 'The Sun', symbol: '☀' },
  { id: 'fool', name: '愚人牌', english: 'The Fool', symbol: '∞' },
  { id: 'magician', name: '魔术师牌', english: 'The Magician', symbol: '✦' },
  { id: 'lovers', name: '恋人牌', english: 'The Lovers', symbol: '♥' },
  { id: 'star', name: '星星牌', english: 'The Star', symbol: '✧' },
  { id: 'world', name: '世界牌', english: 'The World', symbol: '◉' },
  { id: 'high-priestess', name: '女祭司牌', english: 'The High Priestess', symbol: '☾' },
  { id: 'empress', name: '女皇牌', english: 'The Empress', symbol: '♕' },
];

const createRandomCards = () => {
  const cards = Array.from({ length: 23 }, (_, index) => ({
    ...tarotDeck[index % tarotDeck.length],
    instanceId: index,
  }));

  return cards
    .map((card) => ({ card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ card }) => card);
};

export default function TarotPage({ onComplete, completeLabel = '进入下一段' }) {
  const [hovered, setHovered] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const cards = useMemo(() => createRandomCards(), []);

  const cardLayout = useMemo(
    () =>
      cards.map((card, index) => {
        const center = (cards.length - 1) / 2;
        const offset = index - center;
        return {
          card,
          rotation: offset * 4.8,
          x: offset * 43,
          y: Math.abs(offset) * 5.8,
          delay: `${index * 56}ms`,
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
        <p className="tarot-kicker">bless you～</p>
        <h1>Pick a card</h1>
        <p>随意抽一张。愿今天的星光，把最温柔的好运交到你手里。</p>
      </section>

      <section className="tarot-table" aria-label="塔罗牌抽牌区">
        {cardLayout.map((layout, index) => {
          const active = hovered === index || chosen === index;
          return (
            <button
              key={`${layout.card.id}-${layout.card.instanceId}`}
              type="button"
              className={`tarot-card tarot-${layout.card.id} ${active ? 'active' : ''} ${chosen === index ? 'chosen' : ''}`}
              style={{
                '--rot': `${layout.rotation}deg`,
                '--x': `${layout.x + (active && chosen === null ? pointer.x : 0)}px`,
                '--y': `${layout.y + (active && chosen === null ? pointer.y - 18 : 0)}px`,
                '--delay': layout.delay,
              }}
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onClick={() => setChosen(index)}
              aria-label={`抽取第 ${index + 1} 张塔罗牌，${layout.card.name}`}
            >
              <span className="tarot-card-inner">
                <span className="tarot-back">
                  <span className="tarot-back-star">✦</span>
                </span>
                <span className="tarot-front">
                  <span className="major-card-art" aria-hidden="true">
                    <span className="major-card-orbit" />
                    <span className="major-card-symbol">{layout.card.symbol}</span>
                  </span>
                  <span className="tarot-card-title">{layout.card.name}</span>
                  <span className="tarot-card-subtitle">{layout.card.english}</span>
                </span>
              </span>
            </button>
          );
        })}
      </section>

      {chosen !== null ? (
        <div className="tarot-actions">
          <p>看来宇宙也在祝福你！生日快乐，我们都在陪着你。在这一年，你被很多人记住了</p>
          <button type="button" className="btn btn-rose" onClick={onComplete}>
            {completeLabel}
          </button>
        </div>
      ) : null}
    </main>
  );
}
