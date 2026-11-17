/** src/content/log/*.md を開発ログとして読み込む。ファイルを1つ足すだけで記事が増える。 */
type Frontmatter = { title: string; date: string; summary: string };

const files = import.meta.glob<{ frontmatter: Frontmatter; Content: any }>('../content/log/*.md', {
  eager: true,
});

export const logEntries = Object.entries(files)
  .map(([path, mod]) => ({
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
    ...mod.frontmatter,
    Content: mod.Content,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));
