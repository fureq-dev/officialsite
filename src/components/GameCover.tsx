/**
 * タイトルのカバー代わりに使う、ヘアラインの軌道図。
 * 実際のカバー画像ができたら、Showcase.tsx の <GameCover /> を <img> に置き換えてください。
 */
const stroke = { stroke: 'currentColor', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' as const };

export default function GameCover({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" aria-hidden="true" className={`text-ink ${className}`} preserveAspectRatio="xMidYMid slice">
      <g {...stroke} strokeOpacity="0.4">
        <ellipse cx="160" cy="100" rx="120" ry="44" transform="rotate(-18 160 100)" />
        <ellipse cx="160" cy="100" rx="84" ry="30" transform="rotate(26 160 100)" />
        <circle cx="160" cy="100" r="64" strokeOpacity="0.5" />
        <circle cx="262" cy="66" r="3" fill="currentColor" stroke="none" />
        <circle cx="96" cy="118" r="3" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
