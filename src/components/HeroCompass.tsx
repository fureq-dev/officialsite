import Compass from './Compass';

/** ヒーロー背景の計器。ポインターに追従する。 */
export default function HeroCompass() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] items-center justify-end overflow-hidden md:flex">
      <Compass mode="pointer" className="h-[880px] w-[880px] max-w-none translate-x-[22%] shrink-0" />
    </div>
  );
}
