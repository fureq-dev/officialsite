import { useState, type FormEvent } from 'react';
import { contactForm, inquiryTypes, isConfigured } from '../config/form';
import { formTimestamp, submitGoogleForm } from '../lib/gform';

type Status = 'idle' | 'sending' | 'done' | 'error';

const field =
  'h-12 w-full rounded-lg border border-line bg-paper px-4 text-base text-ink transition-colors placeholder:text-ink-3 hover:border-line-strong focus:border-ink focus:outline-none focus-visible:outline-none';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [loggedAt, setLoggedAt] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!isConfigured(contactForm)) {
      console.error('Google Forms の設定が不足しています。.env の PUBLIC_GFORM_* を確認してください。');
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await submitGoogleForm(contactForm.action, {
        [contactForm.entries.name]: String(data.get('name') ?? ''),
        [contactForm.entries.email]: String(data.get('email') ?? ''),
        [contactForm.entries.type]: String(data.get('type') ?? ''),
        [contactForm.entries.message]: String(data.get('message') ?? ''),
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
      <div role="status" className="anim-rise rounded-xl border border-line bg-paper p-8 md:p-12">
        <p className="flex items-center gap-3 font-mono text-base">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal" />
          QUEST LOGGED
        </p>
        <p className="mt-6 text-2xl font-medium leading-9">送信完了</p>
        <p className="mt-2 text-base leading-8 text-ink-2">
          お問い合わせを受け付けました。内容を確認のうえ、ご入力のメールアドレスへご連絡します。
        </p>
        <p className="meta mt-8">{loggedAt}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 inline-flex h-10 items-center rounded-lg border border-line px-4 text-sm transition-colors hover:border-line-strong"
        >
          続けて送信する
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="c-name" className="text-sm text-ink-2">
          お名前
        </label>
        <input id="c-name" name="name" type="text" required autoComplete="name" className={field} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-email" className="text-sm text-ink-2">
          メールアドレス
        </label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="c-type" className="text-sm text-ink-2">
          お問い合わせ種別
        </label>
        <select id="c-type" name="type" required defaultValue="" className={`${field} appearance-none`}>
          <option value="" disabled>
            選択してください
          </option>
          {inquiryTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="c-message" className="text-sm text-ink-2">
          メッセージ内容
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={6}
          className={`${field} h-auto min-h-[160px] resize-y py-3 leading-8`}
        />
      </div>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p role="alert" className="min-h-6 text-sm text-ink-2">
          {status === 'error' ? '送信できませんでした。時間をおいて、もう一度お試しください。' : ''}
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-ink px-8 text-base font-medium text-paper transition-colors hover:bg-ink-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink-3"
        >
          {status === 'sending' ? '送信中' : '送信する'}
        </button>
      </div>
    </form>
  );
}
