import { useEffect, useState } from 'react';
import { letters } from '../data/siteData.js';
import Modal from './Modal.jsx';
import SectionTitle from './SectionTitle.jsx';

const replyKey = (letterId) => `birthday-reply-${letterId}`;

export default function MailboxPage() {
  const [selected, setSelected] = useState(letters[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [savedText, setSavedText] = useState('');

  useEffect(() => {
    if (!selected) return;
    setReply(localStorage.getItem(replyKey(selected.id)) || '');
    setSavedText('');
  }, [selected]);

  const openLetter = (letter) => {
    setSelected(letter);
    setModalOpen(true);
  };

  const saveReply = () => {
    localStorage.setItem(replyKey(selected.id), reply);
    setSavedText('回复已经保存在当前浏览器里。');
  };

  return (
    <section id="letters" className="section-shell">
      <div className="section-container">
        <SectionTitle eyebrow="LETTER BOX" title="年度信箱">
          每一只小信箱都放一封私人信件，也留一个只存在于这台设备里的回复角落。
        </SectionTitle>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(360px,1.1fr)]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {letters.map((letter) => (
              <button
                key={letter.id}
                type="button"
                onClick={() => openLetter(letter)}
                className={`mail-card text-left ${selected?.id === letter.id ? 'is-selected' : ''}`}
              >
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-birthday-lavender/70 text-2xl shadow-sm">
                  ✉
                </span>
                <span className="block text-sm font-black tracking-[0.08em] text-birthday-roseDeep">
                  {letter.date}
                </span>
                <span className="mt-2 block font-display text-2xl font-bold text-[#7a4324]">{letter.title}</span>
              </button>
            ))}
          </div>

          <article className="hidden rounded-[28px] border border-white/80 bg-[#fffaf0]/78 p-7 leading-8 shadow-soft lg:block">
            <p className="text-sm font-black tracking-[0.14em] text-birthday-roseDeep">{selected.date}</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-[#7a4324]">{selected.title}</h3>
            <p className="mt-5 whitespace-pre-line text-birthday-muted">{selected.body}</p>
            <label htmlFor="desktop-reply" className="mt-7 block text-sm font-black text-birthday-ink">
              写给我的回复
            </label>
            <textarea
              id="desktop-reply"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              className="mt-3 min-h-36 w-full resize-y rounded-2xl border-2 border-[#f3c985] bg-white/80 px-4 py-3 outline-none transition focus:border-birthday-roseDeep focus:ring-4 focus:ring-birthday-rose/20"
              placeholder="可以在这里写下回复，内容会保存在当前浏览器里。"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" onClick={saveReply} className="btn btn-rose">
                保存回复
              </button>
              {savedText ? <span className="saved-stamp text-sm font-bold text-birthday-muted">{savedText}</span> : null}
            </div>
          </article>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={selected.title}
        onClose={() => setModalOpen(false)}
        actions={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-soft">
              关闭
            </button>
            <button type="button" onClick={saveReply} className="btn btn-rose">
              保存回复
            </button>
          </>
        }
      >
        <p className="text-sm font-black tracking-[0.14em] text-birthday-roseDeep">{selected.date}</p>
        <p className="mt-4 whitespace-pre-line leading-8 text-birthday-muted">{selected.body}</p>
        <label htmlFor="mobile-reply" className="mt-6 block text-sm font-black text-birthday-ink">
          写给我的回复
        </label>
        <textarea
          id="mobile-reply"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          className="mt-3 min-h-32 w-full resize-y rounded-2xl border-2 border-[#f3c985] bg-white/80 px-4 py-3 outline-none transition focus:border-birthday-roseDeep focus:ring-4 focus:ring-birthday-rose/20"
          placeholder="可以在这里写下回复，内容会保存在当前浏览器里。"
        />
        {savedText ? <p className="saved-stamp mt-3 text-sm font-bold text-birthday-muted">{savedText}</p> : null}
      </Modal>
    </section>
  );
}
