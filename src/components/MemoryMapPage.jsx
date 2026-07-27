const rooms = [
  {
    id: 'tarot',
    label: '占卜桌：抽取塔罗牌及祝福',
    className: 'wall-tarot',
  },
  {
    id: 'quiz',
    label: '留言墙：猜人名游戏',
    className: 'wall-message',
  },
  {
    id: 'puzzle',
    label: '谜题桌：小游戏与隐藏惊喜',
    className: 'wall-cabinet',
  },
  {
    id: 'photos',
    label: '相册架：照片墙',
    className: 'wall-shelf',
  },
  {
    id: 'letters',
    label: '旧信箱：信箱',
    className: 'wall-mailbox',
  },
];

export default function MemoryMapPage({ activeCueId, onEnterRoom, onBackToOpening }) {
  return (
    <main className="memory-map-page">
      <section className="memory-map-hero">
        <div className="memory-map-copy">
          <p className="opening-kicker">A tiny birthday house</p>
          <h1>生日小屋</h1>
          <p>
            这不是任务清单，只是一面藏着小秘密的生日墙。会发光的小物件都可以轻轻点一下。
          </p>
          <button type="button" onClick={onBackToOpening} className="btn btn-soft">
            回到生日信
          </button>
        </div>
      </section>

      <section className="wall-room-wrap" aria-label="生日小屋墙面">
        <div className="wall-room">
          <span className="wall-trim trim-top" />
          <span className="wall-trim trim-bottom" />
          <span className="wall-window" />
          <span className="wall-garland" />
          <span className="wall-decor decor-postcard" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="wall-decor decor-tiny-frame" aria-hidden="true" />
          <span
            className={`wall-decor decor-floor-cushion ${activeCueId === 'gift' ? 'is-cued' : ''}`}
            aria-hidden="true"
          />
          <span className="wall-decor decor-moon-note" aria-hidden="true" />

          {rooms.map((room, index) => (
            <button
              key={room.id}
              type="button"
              onClick={() => onEnterRoom(room.id)}
              className={`wall-object ${room.className} ${activeCueId === room.id ? 'is-cued' : ''}`}
              style={{ '--delay': `${index * 80}ms` }}
              aria-label={room.label}
            >
              <span className="object-glow" />
              <span className="object-shape">
                <span />
                <span />
                <span />
                <span />
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
