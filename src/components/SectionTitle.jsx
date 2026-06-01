export default function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl md:mb-10">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e9c87b] bg-[#fff8da] px-4 py-2 text-xs font-black tracking-[0.14em] text-[#8c5b35] shadow-sm">
        {eyebrow}
      </div>
      <h2 className="font-display text-4xl font-bold leading-tight text-[#5f3a20] md:text-5xl">
        {title}
      </h2>
      {children ? <p className="mt-3 max-w-2xl leading-8 text-birthday-muted">{children}</p> : null}
    </div>
  );
}
