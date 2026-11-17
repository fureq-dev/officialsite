import { useRef, useState, type KeyboardEvent } from 'react';
import Compass from './Compass';
import { coreValues } from '../data/values';

export default function ValueIndex() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const v = coreValues[active];

  const select = (i: number, focus = false) => {
    const n = (i + coreValues.length) % coreValues.length;
    setActive(n);
    if (focus) tabRefs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      select(active + 1, true);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      select(active - 1, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(coreValues.length - 1, true);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-5">
        <Compass
          mode="index"
          angle={active * 72}
          labels={coreValues.map((c) => c.letter)}
          activeIndex={active}
          className="mx-auto h-auto w-full max-w-[400px]"
        />
      </div>

      <div className="md:col-span-7">
        <div role="tablist" aria-label="FUREQ の5つの頭文字" onKeyDown={onKey} className="border-b border-line">
          {coreValues.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.letter}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${c.letter}`}
                aria-selected={on}
                aria-controls="value-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={`relative flex h-14 w-full items-center gap-4 border-t border-line pl-4 text-left transition-colors ${
                  on ? 'text-ink' : 'text-ink-3 hover:text-ink'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-0.5 bg-signal transition-opacity ${
                    on ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <span className="w-6 font-mono text-base">{c.letter}</span>
                <span className="text-base font-medium">{c.en}</span>
                <span className="ml-auto pr-4 text-sm">{c.ja}</span>
              </button>
            );
          })}
        </div>

        <div
          id="value-panel"
          role="tabpanel"
          aria-labelledby={`tab-${v.letter}`}
          className="grid grid-cols-[96px_1fr] items-start gap-6 pt-12 md:grid-cols-[120px_1fr] md:gap-8"
        >
          <div key={`l-${v.letter}`} aria-hidden="true" className="anim-letter font-mono text-8xl leading-none">
            {v.letter}
          </div>
          <div key={`t-${v.letter}`}>
            <p className="anim-rise text-xl font-medium leading-8">
              {v.en}
              <span className="ml-3 text-base font-normal text-ink-3">{v.ja}</span>
            </p>
            <p className="anim-rise mt-4 text-base leading-8 text-ink-2" style={{ ['--d' as string]: '60ms' }}>
              {v.philosophy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
