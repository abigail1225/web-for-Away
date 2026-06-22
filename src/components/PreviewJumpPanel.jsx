import { useState } from 'react';

const jumpItems = [
  { label: '开屏信', type: 'stage', value: 'opening' },
  { label: '小屋', type: 'stage', value: 'home' },
  { label: '塔罗牌', type: 'stage', value: 'tarot' },
  { label: '猜人物', type: 'stage', value: 'quiz' },
  { label: 'Puzzle', type: 'stage', value: 'puzzle' },
  { label: '照片墙', type: 'stage', value: 'photos' },
  { label: '信箱', type: 'stage', value: 'letters' },
];

export default function PreviewJumpPanel({ onStageChange }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!import.meta.env.DEV) return null;

  const jumpTo = (item) => {
    window.location.hash = '';
    onStageChange(item.value);
  };

  return (
    <aside className="fixed bottom-4 right-4 z-[80] w-[min(360px,calc(100vw-32px))] rounded-2xl border border-white/70 bg-[#fffaf0]/90 p-3 text-birthday-ink shadow-[0_18px_50px_rgba(91,59,34,.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-birthday-roseDeep">Local Preview</p>
          <p className="text-sm font-black text-[#7a4324]">快速跳转页面</p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-lg font-black shadow-sm transition hover:bg-white"
          aria-label={collapsed ? '展开预览跳转' : '收起预览跳转'}
        >
          {collapsed ? '+' : '-'}
        </button>
      </div>

      {!collapsed ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {jumpItems.map((item) => (
            <button
              key={`${item.type}-${item.value}`}
              type="button"
              onClick={() => jumpTo(item)}
              className="rounded-full border border-[#e9c87b]/70 bg-white/70 px-3 py-2 text-xs font-black text-[#6a3f24] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
