import { useEffect, useRef } from 'react';

/** ヘッダーの小さな計器。ページのスクロール位置を、針の方位（0〜360°）で示す。 */
export default function HeaderDial() {
  const needle = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      needle.current?.setAttribute('transform', `rotate(${(p * 360).toFixed(1)} 16 16)`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('astro:page-load', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('astro:page-load', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg viewBox="0 0 32 32" width="32" height="32" fill="none" aria-hidden="true" className="text-ink">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeOpacity="0.3" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={(16 + 14 * Math.sin(a)).toFixed(2)}
            y1={(16 - 14 * Math.cos(a)).toFixed(2)}
            x2={(16 + 11 * Math.sin(a)).toFixed(2)}
            y2={(16 - 11 * Math.cos(a)).toFixed(2)}
            stroke="currentColor"
            strokeOpacity="0.4"
          />
        );
      })}
      <g ref={needle} stroke="var(--color-signal)" strokeWidth="1.5">
        <line x1="16" y1="19" x2="16" y2="6" />
      </g>
      <circle cx="16" cy="16" r="1.5" fill="var(--color-paper)" stroke="currentColor" />
    </svg>
  );
}
