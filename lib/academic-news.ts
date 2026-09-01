import type { Post } from "@/lib/data";

const programmeKeywords: Record<string, string[]> = {
  psychology: ["психолог", "ментальн", "психічн", "greenfest"],
  finance: ["фінанс", "банк", "страхув", "інвест", "greenfin"],
  management: ["менедж", "управлін", "підприєм", "гостинност"],
  "public-administration": ["публічн", "муніцип", "громад", "самоврядуван", "реформ"],
  marketing: ["маркетинг", "бренд", "комунікац", "конференц"],
  trade: ["торгів", "ритейл", "підприєм", "бізнес"],
  law: ["прав", "юрид", "суд", "клінік", "муніцип", "законодав"],
  "social-work": ["соціальн", "громадськ", "молод", "добробут"],
  "professional-education": ["освіт", "цифров", "moodle", "технолог", "викладач"],
  tourism: ["туризм", "гостинност", "подорож", "horeca"],
  "languages-humanities": ["мов", "міжкультур", "міжнарод", "гуманітар"],
};

function searchable(post: Post) {
  return `${post.title} ${post.excerpt} ${post.body} ${post.category}`.toLocaleLowerCase("uk-UA");
}

export function selectAcademicNews(posts: Post[], slugs: string[], limit = 3) {
  const keywords = [...new Set(slugs.flatMap((slug) => programmeKeywords[slug] || []))];
  const scored = posts.map((post, order) => {
    const haystack = searchable(post);
    const score = keywords.reduce((total, keyword) => total + (haystack.includes(keyword) ? 1 : 0), 0);
    return { post, score, order };
  });
  const relevant = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((item) => item.post);
  const selected = [...relevant];
  for (const post of posts) {
    if (selected.length >= limit) break;
    if (!selected.some((item) => item.id === post.id)) selected.push(post);
  }
  return selected.slice(0, limit);
}
