import { useState } from 'react';
import { createHugSurprise } from '../hugSurprise.js';

const HUG_STORAGE_KEY = 'birthday-hug-count';

function readSavedHugCount() {
  try {
    const savedValue = window.localStorage.getItem(HUG_STORAGE_KEY);
    const savedCount = Number.parseInt(savedValue, 10);
    return Number.isFinite(savedCount) && savedCount > 0 ? savedCount : 0;
  } catch {
    return 0;
  }
}

function saveHugCount(count) {
  try {
    window.localStorage.setItem(HUG_STORAGE_KEY, String(count));
  } catch {
    // The counter still works for the current visit when storage is unavailable.
  }
}

export default function HugButton({ showCount = false }) {
  const [hugCount, setHugCount] = useState(readSavedHugCount);
  const [message, setMessage] = useState('');
  const [messageKey, setMessageKey] = useState(0);

  const collectHug = () => {
    const nextHug = createHugSurprise(hugCount);

    setHugCount(nextHug.count);
    saveHugCount(nextHug.count);
    setMessage(nextHug.message);
    setMessageKey((current) => current + 1);
  };

  return (
    <aside className="hug-surprise" aria-label="抱抱彩蛋">
      <span className="hug-tooltip" role="tooltip">
        点击这里获得一个抱抱
      </span>
      {message ? (
        <span key={messageKey} className="hug-message-pop" aria-live="polite">
          {message}
        </span>
      ) : null}
      <button type="button" className="hug-button" onClick={collectHug} aria-label="获得一个抱抱">
        <span className="hug-button-sparkle sparkle-one" aria-hidden="true" />
        <span className="hug-button-sparkle sparkle-two" aria-hidden="true" />
        <span className="hug-heart" aria-hidden="true">
          ♡
        </span>
      </button>
      {showCount ? <span className="hug-count">你已经累计获得{hugCount}个抱抱</span> : null}
    </aside>
  );
}
