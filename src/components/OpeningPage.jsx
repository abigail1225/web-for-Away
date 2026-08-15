import { useState } from 'react';
import { openingLetter } from '../data/siteData.js';

const floatingItems = ['✦', '✿', '★', '❀', '♡', '✧', '✦', '✿', '★', '♡'];

export default function OpeningPage({ onEnter, onPlayBirthdaySong }) {
  const [opened, setOpened] = useState(false);
  const [audioHint, setAudioHint] = useState('');

  const openLetter = async () => {
    setOpened(true);
    setAudioHint('');

    try {
      await onPlayBirthdaySong?.();
    } catch {
      setAudioHint('如果没有听到歌，请确认 public/birthday-song.mp3 已放好，或再点一次按钮。');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-7 text-birthday-ink">
      <div className="party-layer" aria-hidden="true">
        {floatingItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="party-piece"
            style={{
              '--x': `${6 + index * 8}%`,
              '--drift': `${index % 2 === 0 ? 34 : -28}px`,
              '--delay': `${index * -0.7}s`,
              '--duration': `${9 + (index % 4)}s`,
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="opening-stage opening-stage-letter">
        <div className="opening-copy opening-copy-letter">
          <p className="opening-kicker">A private birthday letter</p>
          <h1>{openingLetter.title}</h1>
          <p>{openingLetter.subtitle}</p>
        </div>

        <div className="letter-stage">
          <div className="flex min-h-[420px] items-center justify-center perspective-soft md:min-h-[520px]">
            <button
              type="button"
              onClick={openLetter}
              className={`fold-envelope ${opened ? 'open' : ''}`}
              aria-label="打开生日信"
            >
              <span className="env-paper">
                <span className="key-ui" aria-hidden="true">
                  <span className="key-head">
                    <span className="key-window" />
                  </span>
                  <span className="key-stem" />
                  <span className="key-tooth key-tooth-one" />
                  <span className="key-tooth key-tooth-two" />
                </span>
                <span className="key-label">
                  <span>生日小屋钥匙</span>
                  <small>轻轻收好</small>
                </span>
              </span>
              <span className="env-panel env-left" />
              <span className="env-panel env-right" />
              <span className="env-ribbon-v" />
              <span className="env-ribbon-h" />
              <span className="env-bow" aria-hidden="true" />
              <span className="env-flower flower-left" aria-hidden="true">
                ✿
              </span>
              <span className="env-flower flower-right" aria-hidden="true">
                ✿
              </span>
              {!opened ? <span className="env-callout">打开生日信</span> : null}
            </button>
          </div>

          {opened ? (
            <>
              <article className="letter-reveal">
                <strong className="text-birthday-ink">{openingLetter.to}：</strong>
                <p className="mt-3">{openingLetter.body}</p>
              </article>
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={onEnter} className="btn btn-rose">
                  用钥匙进小屋
                </button>
              </div>
            </>
          ) : null}
          {audioHint ? <p className="mt-4 text-center text-sm text-birthday-muted">{audioHint}</p> : null}
        </div>
      </section>
    </main>
  );
}
