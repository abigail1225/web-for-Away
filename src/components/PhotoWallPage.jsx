import { useMemo, useState } from 'react';
import { assetPath, photoCategories } from '../data/siteData.js';
import Modal from './Modal.jsx';
import SectionTitle from './SectionTitle.jsx';

function PhotoCard({ photo, index, onOpen }) {
  const [failed, setFailed] = useState(false);
  const rotate = [-1.5, 1.2, -0.8, 1.6, -1.1, 0.7][index % 6];

  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      className="photo-card group text-left"
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
        <span className="photo-peek">点开回忆</span>
      </div>
      <figcaption className="bg-white/[.78] px-4 py-3 text-sm font-bold text-birthday-muted">{photo.caption}</figcaption>
    </button>
  );
}

export default function PhotoWallPage() {
  const [activeId, setActiveId] = useState(photoCategories[0].id);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [spotlightFailed, setSpotlightFailed] = useState(false);
  const activeCategory = useMemo(
    () => photoCategories.find((category) => category.id === activeId) || photoCategories[0],
    [activeId],
  );
  const openPhoto = (photo) => {
    setSpotlightFailed(false);
    setSelectedPhoto(photo);
  };

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

        <div key={activeCategory.id} className="photo-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activeCategory.photos.map((photo, index) => (
            <PhotoCard key={photo.src} photo={photo} index={index} onOpen={openPhoto} />
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(selectedPhoto)}
        title={selectedPhoto?.caption || '照片'}
        onClose={() => setSelectedPhoto(null)}
        actions={
          <button type="button" onClick={() => setSelectedPhoto(null)} className="btn btn-soft">
            收起照片
          </button>
        }
      >
        {selectedPhoto ? (
          <div className="photo-spotlight">
            {!spotlightFailed ? (
              <img
                src={assetPath(selectedPhoto.src)}
                alt={selectedPhoto.caption}
                onError={() => setSpotlightFailed(true)}
              />
            ) : (
              <div className="photo-spotlight-placeholder">
                <span>✦</span>
                <strong>{selectedPhoto.caption}</strong>
                <small>照片放到对应路径后，这里会显示大图。</small>
              </div>
            )}
            <p>{selectedPhoto.src}</p>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
