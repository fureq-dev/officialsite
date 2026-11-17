import { useEffect, useRef } from 'react';

/**
 * FUREQ の計器: ヘアラインの同心円・目盛り・軌道と、青い針。
 * - mode="pointer": 針がポインターの方位を向く（ヒーロー背景）
 * - mode="index"  : 針が angle で指定された方位へ回る（F・U・R・E・Q インデックス）
 * 針・衛星点・方位表示は rAF で直接 DOM を更新し、収束したらループを止める。
 */

type Props = {
  mode?: 'pointer' | 'index';
  angle?: number;
  labels?: string[];
  activeIndex?: number;
  className?: string;
};

const C = 500;
const R_OUTER = 440;
const RINGS = [96, 192, 288, 384, 440];
const ORBITS = [
  { rx: 380, ry: 148, rot: -24 },
  { rx: 296, ry: 108, rot: 38 },
];

const rad = (d: number) => (d * Math.PI) / 180;
const polar = (r: number, deg: number) => [
  +(C + r * Math.sin(rad(deg))).toFixed(2),
  +(C - r * Math.cos(rad(deg))).toFixed(2),
];
const norm = (d: number) => ((d % 360) + 360) % 360;
const shortest = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

const ticks = Array.from({ length: 72 }, (_, i) => {
  const deg = i * 5;
  const len = i % 6 === 0 ? 20 : 8;
  const [x1, y1] = polar(R_OUTER, deg);
  const [x2, y2] = polar(R_OUTER - len, deg);
  return { x1, y1, x2, y2, major: i % 6 === 0 };
});

export default function Compass({
  mode = 'pointer',
  angle = 0,
  labels,
  activeIndex = 0,
  className = '',
}: Props) {
  const start = mode === 'pointer' ? 32 : angle;
  const svgRef = useRef<SVGSVGElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const satRefs = useRef<(SVGCircleElement | null)[]>([]);
  const readoutRef = useRef<SVGTextElement>(null);
  const cur = useRef(start);
  const tgt = useRef(start);
  const raf = useRef(0);
  const reduced = useRef(false);

  const apply = (a: number) => {
    needleRef.current?.setAttribute('transform', `rotate(${a.toFixed(2)} ${C} ${C})`);
    ORBITS.forEach((o, i) => {
      const t = rad(a * (i === 0 ? 1 : -1.6));
      satRefs.current[i]?.setAttribute('cx', (C + o.rx * Math.cos(t)).toFixed(2));
      satRefs.current[i]?.setAttribute('cy', (C + o.ry * Math.sin(t)).toFixed(2));
    });
    if (readoutRef.current) {
      readoutRef.current.textContent = `bearing ${norm(a).toFixed(1).padStart(5, '0')}°`;
    }
  };

  const tick = () => {
    const d = shortest(tgt.current - cur.current);
    if (reduced.current || Math.abs(d) < 0.05) {
      cur.current += d;
      apply(cur.current);
      raf.current = 0;
      return;
    }
    cur.current += d * 0.14;
    apply(cur.current);
    raf.current = requestAnimationFrame(tick);
  };

  const go = (a: number) => {
    tgt.current = a;
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    apply(cur.current);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pointer mode
  useEffect(() => {
    if (mode !== 'pointer') return;
    const onMove = (e: PointerEvent) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      go((Math.atan2(dx, -dy) * 180) / Math.PI);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // index mode
  useEffect(() => {
    if (mode === 'index') go(angle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, angle]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 1000"
      role="img"
      aria-label={mode === 'index' ? 'FUREQ のコンパス。選択中の項目を針が指す' : undefined}
      aria-hidden={mode === 'pointer' ? true : undefined}
      className={`text-ink ${className}`}
      fill="none"
    >
      {/* rings */}
      <g stroke="currentColor" strokeOpacity="0.14" strokeWidth="1">
        {RINGS.map((r) => (
          <circle key={r} cx={C} cy={C} r={r} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* ticks */}
      <g stroke="currentColor" strokeWidth="1">
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            strokeOpacity={t.major ? 0.4 : 0.2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* crosshair */}
      <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
        <line x1={C} y1={C - R_OUTER} x2={C} y2={C + R_OUTER} vectorEffect="non-scaling-stroke" />
        <line x1={C - R_OUTER} y1={C} x2={C + R_OUTER} y2={C} vectorEffect="non-scaling-stroke" />
      </g>

      {/* orbits + satellites */}
      {ORBITS.map((o, i) => (
        <g key={i} transform={`rotate(${o.rot} ${C} ${C})`}>
          <ellipse
            cx={C}
            cy={C}
            rx={o.rx}
            ry={o.ry}
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            ref={(el) => {
              satRefs.current[i] = el;
            }}
            cx={C + o.rx * Math.cos(rad(start * (i === 0 ? 1 : -1.6)))}
            cy={C + o.ry * Math.sin(rad(start * (i === 0 ? 1 : -1.6)))}
            r="5"
            fill="currentColor"
          />
        </g>
      ))}

      {/* index labels */}
      {labels?.map((l, i) => {
        const deg = i * 72;
        const [lx, ly] = polar(476, deg);
        const [x1, y1] = polar(404, deg);
        const [x2, y2] = polar(R_OUTER + 12, deg);
        const active = i === activeIndex;
        return (
          <g key={l}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeOpacity={active ? 0.6 : 0.25}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize="24"
              fill="currentColor"
              fillOpacity={active ? 1 : 0.45}
            >
              {l}
            </text>
          </g>
        );
      })}

      {/* needle */}
      <g
        ref={needleRef}
        transform={`rotate(${start} ${C} ${C})`}
        stroke="var(--color-signal)"
        strokeWidth="1.5"
      >
        <line x1={C} y1={C + 72} x2={C} y2={C - 384} vectorEffect="non-scaling-stroke" />
        <line
          x1={C - 6}
          y1={C - 384}
          x2={C + 6}
          y2={C - 384}
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <circle
        cx={C}
        cy={C}
        r="5"
        fill="var(--color-paper)"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      {/* readout */}
      <text
        ref={readoutRef}
        x={C}
        y={C + 124}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="16"
        fill="currentColor"
        fillOpacity="0.55"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`bearing ${norm(start).toFixed(1).padStart(5, '0')}°`}
      </text>
    </svg>
  );
}
