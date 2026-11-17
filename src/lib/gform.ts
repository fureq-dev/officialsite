/** Google フォームへ非同期送信する（no-cors のためレスポンスは読めない。例外が出なければ成功扱い） */
export async function submitGoogleForm(action: string, entries: Record<string, string>) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(entries)) body.append(key, value);
  await fetch(action, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

export function formTimestamp(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
