import { useCallback, useEffect, useMemo, useState } from 'react';
import { assetPath, gameLevels } from '../data/siteData.js';
import BouquetRotationPuzzle from './BouquetRotationPuzzle.jsx';
import Modal from './Modal.jsx';
import SectionTitle from './SectionTitle.jsx';

const storageKey = 'birthday-puzzle-solved';

const normalizeAnswer = (value) => value.trim().replace(/\s+/g, '').toLowerCase();

export default function GamePage({ onFinish, finishLabel = '去照片墙' }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [solved, setSolved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  });
  const [successOpen, setSuccessOpen] = useState(false);

  const level = gameLevels[levelIndex];
  const solvedCount = useMemo(() => Object.values(solved).filter(Boolean).length, [solved]);
  const isLastLevel = levelIndex === gameLevels.length - 1;

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(solved));
  }, [solved]);

  const markCurrentLevelSolved = useCallback(() => {
    setSolved((current) => (current[level.id] ? current : { ...current, [level.id]: true }));
  }, [level.id]);

  const submitAnswer = (event) => {
    event.preventDefault();
    const accepted = level.answers.map(normalizeAnswer);

    if (accepted.includes(normalizeAnswer(answer))) {
      setSolved((current) => ({ ...current, [level.id]: true }));
      setSuccessOpen(true);
      setMessage('');
      return;
    }

    setMessage('再想一想，答案就藏在你们的回忆里。');
  };

  const goNext = () => {
    setSuccessOpen(false);
    setAnswer('');
    setMessage('');
    if (!isLastLevel) {
      setLevelIndex((current) => current + 1);
    } else {
      if (onFinish) {
        onFinish();
        return;
      }
      window.location.hash = 'photos';
    }
  };

  return (
    <section id="games" className="section-shell">
      <div className="section-container">
        <SectionTitle eyebrow="SECRET LEVEL" title="Puzzle Time">
          通过一点点默契，兑换现实里的小礼物。关卡内容都在数组里，后续可以轻松替换。
        </SectionTitle>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]">
          <article className="rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-soft md:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-birthday-roseDeep">
                  {String(levelIndex + 1).padStart(2, '0')} / {String(gameLevels.length).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold text-[#7a4324]">{level.title}</h3>
              </div>
              <span className="rounded-full bg-birthday-blue/45 px-4 py-2 text-sm font-extrabold text-[#4d6588]">
                {level.type}
              </span>
            </div>

            <div className="puzzle-progress" aria-label="Puzzle Time 解锁进度">
              {gameLevels.map((item, index) => (
                <span
                  key={item.id}
                  className={`puzzle-progress-dot ${index === levelIndex ? 'active' : ''} ${solved[item.id] ? 'solved' : ''}`}
                />
              ))}
            </div>

            <p className="leading-8 text-birthday-muted">{level.description}</p>
            <p className="mt-4 rounded-2xl border border-dashed border-birthday-rose/70 bg-[#fff8df] px-4 py-3 text-sm leading-7 text-birthday-muted">
              {level.hint}
            </p>

            {level.kind === 'rotation-puzzle' ? (
              <div className="mt-6">
                <BouquetRotationPuzzle
                  imageSrc={assetPath('puzzle/birthday-bouquet.jpg')}
                  onSolved={markCurrentLevelSolved}
                  onAdvance={goNext}
                />
              </div>
            ) : (
              <form onSubmit={submitAnswer} className="mt-6 space-y-4">
                <label className="block text-sm font-black text-birthday-ink" htmlFor="puzzle-answer">
                  输入你的答案
                </label>
                <input
                  id="puzzle-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  className="w-full rounded-2xl border-2 border-[#f3c985] bg-white/90 px-4 py-3 text-birthday-ink outline-none transition focus:border-birthday-roseDeep focus:ring-4 focus:ring-birthday-rose/20"
                  placeholder="答案不会区分大小写和空格"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="btn btn-rose">
                    提交答案
                  </button>
                  {message ? <span className="text-sm font-bold text-birthday-muted">{message}</span> : null}
                </div>
              </form>
            )}
          </article>

          <aside className="rounded-[28px] border border-white/80 bg-white/60 p-5 shadow-soft md:p-7">
            <h3 className="font-display text-2xl font-bold text-[#7a4324]">礼物进度</h3>
            <p className="mt-2 text-sm leading-7 text-birthday-muted">
              已解锁 {solvedCount} / {gameLevels.length}。保持一点神秘感，真正的礼物说明会在答对后出现。
            </p>
            <div className="mt-5 space-y-3">
              {gameLevels.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setLevelIndex(index)}
                  className={`puzzle-level-button w-full rounded-2xl border px-4 py-3 text-left transition ${
                    index === levelIndex
                      ? 'border-birthday-rose bg-birthday-pink/60'
                      : 'border-white/70 bg-white/[.65] hover:bg-white'
                  }`}
                >
                  <span className="block text-sm font-black text-birthday-ink">{item.title}</span>
                  <span className="mt-1 block text-xs font-bold text-birthday-muted">
                    {solved[item.id] ? '已解锁' : '等待破解'}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <Modal
        open={successOpen}
        title="聪明如你"
        onClose={() => setSuccessOpen(false)}
        actions={
          <button type="button" onClick={goNext} className="btn btn-lavender">
            {isLastLevel ? finishLabel : '进入下一关'}
          </button>
        }
      >
        <p className="leading-8 text-birthday-muted">{level.gift}</p>
      </Modal>
    </section>
  );
}
