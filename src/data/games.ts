/**
 * ショーケースに表示するタイトル一覧。
 * 現在は、最初の1作を開発中です。タイトルや内容が決まったら、この1件を書き換えてください。
 * ジャンル・プラットフォーム・プレイ人数は、決まっている項目だけ記入すれば表示されます。
 */
export type GameStatus = 'dev' | 'released';

export type Game = {
  id: string;
  title: string;
  status: GameStatus;
  summary: string;
  detail: string;
  /** 開発の段階（stages の添字）。released のときは自動で最終段階になる */
  stage?: number;
  genre?: string;
  platform?: string;
  players?: string;
};

/** 開発の段階。現在の段階は各タイトルの stage で指定する */
export const stages = ['企画', '試作', 'アルファ', 'ベータ', 'リリース'];

export const statusLabel: Record<GameStatus, string> = {
  dev: '開発中',
  released: 'リリース済み',
};

export const games: Game[] = [
  {
    id: 'first-title',
    title: 'タイトル未定',
    status: 'dev',
    stage: 0,
    summary: 'FUREQ として最初に世に出すゲームを開発しています',
    detail:
      'FUREQ として最初に世に出すゲームを開発しています。タイトルや内容は、公開できる段階になり次第ここでお知らせします。',
  },
];
