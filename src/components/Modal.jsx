export default function Modal({ open, title, children, actions, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#5b3b22]/30 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-xl animate-popIn rounded-[28px] border border-white/80 bg-[#fffaf0] p-6 text-birthday-ink shadow-[0_28px_80px_rgba(91,59,34,.32)] md:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 id="modal-title" className="font-display text-3xl font-bold text-[#7a4324]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/80 text-xl font-bold text-birthday-muted shadow-sm transition hover:bg-white"
            aria-label="关闭弹窗"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
        {actions ? <div className="mt-6 flex flex-wrap justify-end gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
