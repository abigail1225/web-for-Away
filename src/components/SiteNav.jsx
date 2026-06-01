const navItems = [
  { href: '#games', label: 'Puzzle Time' },
  { href: '#photos', label: '照片墙' },
  { href: '#letters', label: '信箱' },
];

export default function SiteNav({ onBackToOpening }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#e9c87b]/50 bg-[#fff4c7]/86 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-20 w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 py-3">
        <button
          type="button"
          onClick={onBackToOpening}
          className="rounded-full border border-[#e9c87b] bg-[#fffaf0]/80 px-4 py-2 text-sm font-black tracking-[0.08em] text-[#6a3f24] shadow-button transition hover:-translate-y-0.5 hover:bg-white"
        >
          Birthday Surprise
        </button>
        <div className="flex flex-wrap justify-end gap-2">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={[
                'rounded-full bg-[#fffaf0]/78 px-4 py-2 text-sm font-extrabold text-birthday-ink shadow-button transition hover:-translate-y-0.5 hover:bg-white',
                index === 0 ? 'border-2 border-birthday-rose/60' : '',
                index === 1 ? 'border-2 border-birthday-blue/80' : '',
                index === 2 ? 'border-2 border-birthday-lavender/80' : '',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
