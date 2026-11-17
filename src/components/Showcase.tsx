import { useEffect, useRef, useState } from 'react';
import { games, statusLabel, type Game, type GameStatus } from '../data/games';
import GameCover from './GameCover';
import { withBase } from '../lib/url';

type Filter = 'all' | GameStatus;

const tabs: { id: Filter; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'dev', label: '開発中' },
  { id: 'released', label: 'リリース済み' },
];

const count = (f: Filter) => (f === 'all' ? games.length : games.filter((g) => g.status === f).length);

function StatusMark({ status }: { status: GameStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-3">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full border border-ink ${status === 'released' ? 'bg-ink' : 'bg-transparent'}`}
      />
      {statusLabel[status]}
    </span>
  );
}

export default function Showcase() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Game | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const facts = (
    selected
      ? ([
          ['ジャンル', selected.genre],
          ['プラットフォーム', selected.platform],
          ['プレイ人数', selected.players],
        ] as [string, string | undefined][])
      : []
  ).filter(([, v]) => v);

  const visible = filter === 'all' ? games : games.filter((g) => g.status === filter);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (selected && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
    if (!selected && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [selected]);

  const close = () => {
    setSelected(null);
    document.documentElement.style.overflow = '';
    lastTrigger.current?.focus();
  };

  return (
    <div>
      <div
        role="group"
        aria-label="ステータスで絞り込む"
        className="inline-flex gap-1 rounded-lg border border-line p-1"
      >
        {tabs.map((t) => {
          const on = filter === t.id;
          return (
            <button
              key={t.id}
              aria-pressed={on}
              onClick={() => setFilter(t.id)}
              className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm transition-colors ${
                on ? 'bg-canvas text-ink ring-1 ring-ink/20' : 'text-ink-3 hover:text-ink'
              }`}
            >
              {t.label}
              <span className="meta !text-xs">{count(t.id)}</span>
            </button>
          );
        })}
      </div>

      <ul key={filter} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((g, i) => (
          <li key={g.id} className="anim-rise" style={{ ['--d' as string]: `${i * 40}ms` }}>
            <button
              type="button"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setSelected(g);
              }}
              aria-haspopup="dialog"
              className="group block h-full w-full overflow-hidden rounded-xl border border-line bg-paper text-left transition-colors hover:border-line-strong"
            >
              <div className="aspect-[8/5] overflow-hidden border-b border-line bg-canvas">
                <GameCover
                  className="h-full w-full opacity-70 transition-[transform,opacity] duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-col gap-2 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-medium leading-7">{g.title}</h3>
                  <StatusMark status={g.status} />
                </div>
                {(g.genre || g.platform) && (
                  <p className="meta">{[g.genre, g.platform].filter(Boolean).join(' / ')}</p>
                )}
                <p className="text-sm leading-6 text-ink-2">{g.summary}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="mt-8 rounded-xl border border-line p-8 text-base text-ink-3">
          リリース済みのタイトルはまだありません
        </p>
      )}

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-labelledby="game-dialog-title"
        className="game-dialog m-auto w-[calc(100%-32px)] max-w-[720px] max-h-[calc(100%-32px)] overflow-y-auto rounded-2xl border border-line bg-paper p-0 text-ink"
      >
        {selected && (
          <div>
            <div className="relative aspect-[8/3] overflow-hidden border-b border-line bg-canvas">
              <GameCover className="h-full w-full" />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <StatusMark status={selected.status} />
                  <h3 id="game-dialog-title" className="mt-1 text-2xl font-medium leading-9">
                    {selected.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-line px-3 text-sm text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                >
                  閉じる
                  <span className="keycap">Esc</span>
                </button>
              </div>
              <p className="mt-4 text-base leading-8 text-ink-2">{selected.detail}</p>
              <a
                href={withBase(`titles/${selected.id}/`)}
                className="mt-6 inline-flex text-base text-ink-2 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
              >
                詳細ページを見る
              </a>
              {facts.length > 0 && (
                <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-6">
                  {facts.map(([k, val]) => (
                    <div key={k}>
                      <dt className="text-sm text-ink-3">{k}</dt>
                      <dd className="mt-1 text-sm">{val}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
