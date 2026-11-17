import { useState, type FormEvent } from 'react';
import { isConfigured, notifyForm, notifyKinds } from '../config/form';
import { formTimestamp, submitGoogleForm } from '../lib/gform';

type Status = 'idle' | 'sending' | 'done' | 'error';

const field =
  'h-12 w-full rounded-lg border border-line bg-paper px-4 text-base text-ink transition-colors placeholder:text-ink-3 hover:border-line-strong focus:border-ink focus:outline-none focus-visible:outline-none';

export default function NotifyForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [loggedAt, setLoggedAt] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!isConfigured(notifyForm)) {
      console.error('更新情報フォームの設定が不足しています。.env の PUBLIC_GFORM_NOTIFY_* を確認してください。');
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await submitGoogleForm(notifyForm.action, {
        [notifyForm.entries.email]: String(data.get('email') ?? ''),
        [notifyForm.entries.kind]: String(data.get('kind') ?? ''),
      });
      setLoggedAt(formTimestamp());
      form.reset();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div role="status" className="anim-rise rounded-xl border border-line bg-paper p-8">
        <p className="flex items-center gap-3 font-mono text-base">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal" />
          REGISTERED
        </p>
        <p className="mt-6 text-xl font-medium leading-8">登録完了</p>
        <p className="mt-2 text-base leading-8 text-ink-2">ご登録ありがとうございます。開発の状況をお知らせします。</p>
        <p className="meta mt-6">{loggedAt}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="n-email" className="text-sm text-ink-2">
          メールアドレス
        </label>
        <input id="n-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="n-kind" className="text-sm text-ink-2">
          ご希望の内容
        </label>
        <select id="n-kind" name="kind" required defaultValue="" className={`${field} appearance-none`}>
          <option value="" disabled>
            選択してください
          </option>
          {notifyKinds.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p role="alert" className="min-h-6 text-sm text-ink-2">
          {status === 'error' ? '送信できませんでした。時間をおいて、もう一度お試しください。' : ''}
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-ink px-8 text-base font-medium text-paper transition-colors hover:bg-ink-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink-3"
        >
          {status === 'sending' ? '送信中' : '登録する'}
        </button>
      </div>
    </form>
  );
}
