export type CoreValue = {
  letter: 'F' | 'U' | 'R' | 'E' | 'Q';
  en: string;
  ja: string;
  philosophy: string;
};

export const coreValues: CoreValue[] = [
  {
    letter: 'F',
    en: 'Fun',
    ja: '楽しさ',
    philosophy:
      '説明を読む前に、手が動いて楽しいと感じられること。操作の手触りとテンポを、企画の最初の段階から確かめながら作ります。',
  },
  {
    letter: 'U',
    en: 'Uniqueness',
    ja: '独自性',
    philosophy:
      '既存のジャンル名だけで説明できてしまう企画は、一度立ち止まって見直します。遊びの核になる一点を決め、開発時間をそこに集めます。',
  },
  {
    letter: 'R',
    en: 'Replayability',
    ja: '何度でも遊びたくなる魅力',
    philosophy:
      '二度目、三度目に新しい発見があるか。ルールの組み合わせと判断の余地を、遊ぶたびに結果が変わる構造として設計に組み込みます。',
  },
  {
    letter: 'E',
    en: 'Excitement',
    ja: 'ワクワク、興奮',
    philosophy:
      '緊張と解放の間隔を設計します。音、演出、操作の反応を、気持ちが盛り上がる瞬間に合わせて調整します。',
  },
  {
    letter: 'Q',
    en: 'Quest',
    ja: '探求',
    philosophy:
      '答えが一つに決まらない問いを、遊びの中に置きます。プレイヤーが自分で見つけた手応えを、いちばん大切にしています。',
  },
];
