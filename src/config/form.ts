/**
 * Google フォーム連携の設定（2フォーム）。
 * 値は .env（または GitHub Actions の Variables）の PUBLIC_GFORM_* で管理します。取得手順は README を参照。
 */
const env = import.meta.env as Record<string, string | undefined>;

type FormConfig = { action: string; entries: Record<string, string> };

/** お問い合わせ */
export const contactForm = {
  action: env.PUBLIC_GFORM_ACTION ?? 'https://docs.google.com/forms/d/e/1FAIpQLScP5eUemL9Nqk2uY51N9onDJA3yWdAtJPtoqUm6Q3CBuxPObw/formResponse',
  entries: {
    name: env.PUBLIC_GFORM_ENTRY_NAME ?? 'entry.1412518462',
    email: env.PUBLIC_GFORM_ENTRY_EMAIL ?? 'entry.820629378',
    type: env.PUBLIC_GFORM_ENTRY_TYPE ?? 'entry.1559994908',
    message: env.PUBLIC_GFORM_ENTRY_MESSAGE ?? 'entry.563152595',
  },
} satisfies FormConfig;

/** 更新情報・テストプレイの登録 */
export const notifyForm = {
  action: env.PUBLIC_GFORM_NOTIFY_ACTION ?? 'https://docs.google.com/forms/d/e/1FAIpQLSc_7jls6EL-4N_6OFVpwV9P2_ZJrwFX4OPdWgYEstiIZ4hqeg/formResponse',
  entries: {
    email: env.PUBLIC_GFORM_NOTIFY_ENTRY_EMAIL ?? 'entry.981333461',
    kind: env.PUBLIC_GFORM_NOTIFY_ENTRY_KIND ?? 'entry.278956799',
  },
} satisfies FormConfig;

export const isConfigured = (f: FormConfig) =>
  f.action !== '' && Object.values(f.entries).every((v) => v !== '');

/** 選択肢は Google フォーム側の選択肢と、文字列を完全に一致させてください。 */
export const inquiryTypes = ['お仕事のご相談', '取材・メディア', 'ゲームへのご感想', 'その他'] as const;
export const notifyKinds = ['更新情報の受け取り', 'テストプレイ参加希望', '両方'] as const;