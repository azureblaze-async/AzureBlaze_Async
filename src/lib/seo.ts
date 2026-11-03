export const SITE_ORIGIN = 'https://www.azureblaze.space';
export const SHARE_IMAGE = `${SITE_ORIGIN}/images/azureblaze-share.webp`;
export function cleanLabel(value: string) {
  return value.replace(/^\s*(?:title|description|excerpt|seo_title|seo_description)\s*:\s*/i, '').trim().replace(/^(["'])([\s\S]*)\1$/, '$2');
}
export function unbrandedTitle(value: string) {
  return cleanLabel(value).replace(/(?:\s*[|—–-]\s*AzureBlaze)+\s*$/i, '').trim();
}
export function plainText(value: string) {
  return cleanLabel(value).replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]*>/g, '').replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim();
}
export function metaDescription(value: string, title: string) {
  let text = plainText(value);
  if (text.length < 140) text += `${text ? ' ' : ''}${unbrandedTitle(title)} explores the foundations of technology, engineering and everyday systems through ideas and questions from anonymous builder AzureBlaze.`;
  if (text.length <= 160) return text;
  const end = text.slice(0, 157);
  const boundary = end.lastIndexOf(' ');
  return `${end.slice(0, boundary >= 139 ? boundary : 157).replace(/[.,;:!?]$/, '')}…`;
}
export function pageHead(path: string, title: string, description: string, type = 'website') {
  const url = `${SITE_ORIGIN}${path}`;
  return {
    meta: [
      { title }, { name: 'description', content: description },
      { property: 'og:title', content: title }, { property: 'og:description', content: description },
      { property: 'og:url', content: url }, { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'AzureBlaze' },
      { property: 'og:image', content: SHARE_IMAGE },
      { property: 'og:image:width', content: '1200' }, { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title }, { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: SHARE_IMAGE },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}