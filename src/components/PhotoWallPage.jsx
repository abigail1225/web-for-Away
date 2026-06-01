import { useMemo, useState } from 'react';
import { assetPath, photoCategories } from '../data/siteData.js';
import SectionTitle from './SectionTitle.jsx';

function PhotoCard({ photo, index }) {
  const [failed, setFailed] = useState(false);
  const rotate = [-1.5, 1.2, -0.8, 1.6, -1.1, 0.7][index % 6];

  return (
    <figure
      className="group overflow-hidden rounded-[24px] border-[7px] border-white/75 bg-white/70 shadow-soft transition hover:-translate-y-1"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-white via-[#fff1c2] to-[#ddecff]">
        {!failed ? (
          <img
            src={assetPath(photo.src)}
            alt={photo.caption}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center p-5 text-center">
            <div>
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/70 text-3xl shadow-sm">
                ✦
              </div>
              <p className="font-black text-birthday-ink">{photo.caption}</p>
              <p className="mt-2 text-sm leading-6 text-birthday-muted">把照片放进对应文件夹后，这里会自动显示。</p>
            </div>
          </div>
        )}
      </div>
      <figcaption className="bg-white/[.78] px-4 py-3 text-sm font-bold text-birthday-muted">{photo.caption}</figcaption>
    </figure>
  );
}

export default function PhotoWallPage() {
  const [activeId, setActiveId] = useState(photoCategories[0].id);
  const activeCategory = useMemo(
    () => photoCategories.find((category) => category.id === activeId) || photoCategories[0],
    [activeId],
  );

  return (
    <section id="photos" className="section-shell">
      <div className="section-container">
        <SectionTitle eyebrow="MEMORY WALL" title="我们的照片墙">
          点击不同标签，看不同口味的回忆。照片加载失败时会保留温柔占位，不会把页面弄乱。
        </SectionTitle>

        <div className="mb-7 flex flex-wrap justify-center gap-2">
          {photoCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-black shadow-button transition hover:-translate-y-0.5 ${
                activeId === category.id
                  ? 'bg-birthday-rose text-white'
                  : 'border border-white/80 bg-white/70 text-birthday-ink hover:bg-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mb-5 rounded-3xl border border-white/80 bg-white/[.55] px-5 py-4 text-sm leading-7 text-birthday-muted shadow-sm">
          当前分类：<strong className="text-birthday-ink">{activeCategory.label}</strong>。替换路径：
          <code className="ml-1 rounded bg-white/75 px-2 py-1">{activeCategory.folder}</code>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activeCategory.photos.map((photo, index) => (
            <PhotoCard key={photo.src} photo={photo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
