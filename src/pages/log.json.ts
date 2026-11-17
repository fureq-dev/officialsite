import type { APIRoute } from 'astro';
import { logEntries } from '../lib/log';
import { withBase } from '../lib/url';

/** 開発ログの一覧を JSON で公開する。GAS が定期的に読み、新着があれば登録者へメールする。 */
export const GET: APIRoute = ({ site }) => {
  const origin = (site?.origin ?? '').replace(/\/$/, '');
  const body = logEntries.map((e) => ({
    slug: e.slug,
    title: e.title,
    date: e.date,
    summary: e.summary,
    url: `${origin}${withBase(`log/${e.slug}/`)}`,
  }));
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
