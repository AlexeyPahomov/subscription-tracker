/**
 * Сопоставление названия подписки со slug’ом Simple Icons
 * (https://simpleicons.org/ → CDN https://cdn.simpleicons.org/{slug}).
 * Совпадения ищутся по подстроке в нормализованном имени; более длинные фразы — первыми.
 */
const ENTRIES: { match: string; slug: string }[] = [
  { match: 'youtube music', slug: 'youtubemusic' },
  { match: 'apple music', slug: 'applemusic' },
  { match: 'apple tv', slug: 'appletv' },
  { match: 'apple arcade', slug: 'applearcade' },
  { match: 'google drive', slug: 'googledrive' },
  { match: 'google one', slug: 'google' },
  { match: 'google photos', slug: 'googlephotos' },
  { match: 'google play', slug: 'googleplay' },
  { match: 'adobe creative cloud', slug: 'adobecreativecloud' },
  { match: 'adobe photoshop', slug: 'adobephotoshop' },
  { match: 'microsoft 365', slug: 'microsoft' },
  { match: 'office 365', slug: 'microsoft' },
  { match: 'github copilot', slug: 'githubcopilot' },
  { match: 'hbo max', slug: 'hbomax' },
  { match: 'disney plus', slug: 'disneyplus' },
  { match: 'disney+', slug: 'disneyplus' },
  { match: 'amazon prime video', slug: 'primevideo' },
  { match: 'prime video', slug: 'primevideo' },
  { match: 'amazon prime', slug: 'amazonprime' },
  { match: 'new york times', slug: 'newyorktimes' },
  { match: 'ny times', slug: 'newyorktimes' },
  { match: 'washington post', slug: 'thewashingtonpost' },
  { match: 'wall street journal', slug: 'thewallstreetjournal' },
  { match: 'linkedin premium', slug: 'linkedin' },
  { match: 'playstation plus', slug: 'playstation' },
  { match: 'xbox game pass', slug: 'xbox' },
  { match: 'nintendo switch online', slug: 'nintendo' },
  { match: 'paramount plus', slug: 'paramountplus' },
  { match: 'paramount+', slug: 'paramountplus' },
  { match: 'discovery plus', slug: 'discoveryplus' },
  { match: 'chatgpt', slug: 'openai' },
  { match: 'openai', slug: 'openai' },
  { match: 'netflix', slug: 'netflix' },
  { match: 'spotify', slug: 'spotify' },
  { match: 'notion', slug: 'notion' },
  { match: 'figma', slug: 'figma' },
  { match: 'slack', slug: 'slack' },
  { match: 'discord', slug: 'discord' },
  { match: 'zoom', slug: 'zoom' },
  { match: 'dropbox', slug: 'dropbox' },
  { match: 'onedrive', slug: 'microsoftonedrive' },
  { match: 'evernote', slug: 'evernote' },
  { match: 'todoist', slug: 'todoist' },
  { match: '1password', slug: '1password' },
  { match: 'lastpass', slug: 'lastpass' },
  { match: 'nordvpn', slug: 'nordvpn' },
  { match: 'expressvpn', slug: 'expressvpn' },
  { match: 'duolingo', slug: 'duolingo' },
  { match: 'strava', slug: 'strava' },
  { match: 'headspace', slug: 'headspace' },
  { match: 'calm', slug: 'calm' },
  { match: 'audible', slug: 'audible' },
  { match: 'kindle', slug: 'amazonkindle' },
  { match: 'twitch', slug: 'twitch' },
  { match: 'patreon', slug: 'patreon' },
  { match: 'medium', slug: 'medium' },
  { match: 'substack', slug: 'substack' },
  { match: 'canva', slug: 'canva' },
  { match: 'jetbrains', slug: 'jetbrains' },
  { match: 'github', slug: 'github' },
  { match: 'gitlab', slug: 'gitlab' },
  { match: 'hulu', slug: 'hulu' },
  { match: 'peacock', slug: 'peacock' },
  { match: 'crunchyroll', slug: 'crunchyroll' },
  { match: 'steam', slug: 'steam' },
  { match: 'epic games', slug: 'epicgames' },
  { match: 'playstation', slug: 'playstation' },
  { match: 'xbox', slug: 'xbox' },
  { match: 'nintendo', slug: 'nintendo' },
  { match: 'telegram', slug: 'telegram' },
  { match: 'whatsapp', slug: 'whatsapp' },
  { match: 'youtube', slug: 'youtube' },
  { match: 'youtube premium', slug: 'youtube' },
  { match: 'apple', slug: 'apple' },
  { match: 'google', slug: 'google' },
  { match: 'microsoft', slug: 'microsoft' },
  { match: 'adobe', slug: 'adobe' },
  { match: 'amazon', slug: 'amazon' },
  { match: 'linkedin', slug: 'linkedin' },
  { match: 'twitter', slug: 'x' },
  { match: 'x premium', slug: 'x' },
];

const SORTED = [...ENTRIES].sort((a, b) => b.match.length - a.match.length);

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Возвращает slug Simple Icons или null, если бренд не распознан. */
export function resolveSubscriptionBrandSlug(name: string): string | null {
  const n = normalizeName(name);
  if (!n) return null;

  for (const { match, slug } of SORTED) {
    const m = match.trim();
    if (n.includes(m)) return slug;
  }

  return null;
}

export function simpleIconsCdnUrl(slug: string): string {
  return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}`;
}
