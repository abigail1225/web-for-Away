import { useState } from 'react';
import {
  birthdayConfettiColors,
  blowBirthdayCandle,
  createBirthdayConfettiPieces,
} from '../birthdayMoment.js';

const confettiPieces = createBirthdayConfettiPieces();

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
    label: '谜题桌：小游戏与隐藏线索',
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

export default function MemoryMapPage({ activeCueId, roomLighting, onToggleLights, onEnterRoom, onBackToOpening }) {
  const [birthdayMoment, setBirthdayMoment] = useState({
    candleBlownOut: false,
    confettiBurst: 0,
  });
  const { lightsOff = false, showBirthdayMoment = false } = roomLighting || {};

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
        <div className={`wall-room ${lightsOff ? 'is-lights-off' : ''}`}>
          <button
            type="button"
            className="room-light-switch"
            aria-pressed={lightsOff}
            onClick={onToggleLights}
          >
            {lightsOff ? '开灯' : '关灯'}
          </button>
          <span className="room-night-overlay" aria-hidden="true" />
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

          {showBirthdayMoment ? (
            <div className="birthday-night-moment" aria-label="生日蛋糕和礼花">
              <div
                className={`birthday-cake ${birthdayMoment.candleBlownOut ? 'is-blown-out' : ''}`}
                aria-hidden="true"
              >
                <span className="cake-plate" />
                <span className="cake-layer cake-bottom" />
                <span className="cake-layer cake-top" />
                <span className="cake-cream" />
                <span className="number-candle candle-two">2</span>
                <span className="number-candle candle-three">3</span>
                <span className="candle-wick" />
                <span className="candle-smoke" />
                <span className="candle-flame" />
              </div>

              <button
                type="button"
                className="party-popper"
                aria-label="吹蜡烛并发射彩带"
                onClick={() => setBirthdayMoment((current) => blowBirthdayCandle(current))}
              >
                <span className="party-popper-body" />
                <span className="party-popper-label">吹一下</span>
              </button>

              {birthdayMoment.confettiBurst > 0 ? (
                <div key={birthdayMoment.confettiBurst} className="confetti-burst" aria-hidden="true">
                  {confettiPieces.map((piece, index) => (
                    <span
                      key={`${piece.delay}-${piece.rot}-${index}`}
                      style={{
                        '--confetti-delay': piece.delay,
                        '--confetti-rot': piece.rot,
                        '--confetti-x': piece.x,
                        '--confetti-y': piece.y,
                        '--confetti-width': piece.w,
                        '--confetti-height': piece.h,
                        '--confetti-duration': piece.duration,
                        '--confetti-color': birthdayConfettiColors[index % birthdayConfettiColors.length],
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

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
