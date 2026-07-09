// Dynamically generated llms.txt (https://llmstxt.org/) describing the site for
// LLM agents. Generating it means the blog/resource listings stay current.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from '../consts';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const resources = (
    await getCollection('resources', ({ data }) => !data.draft)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const lines = [
    `# ${SITE_TITLE}`,
    '',
    `> ${SITE_TAGLINE} ${SITE_DESCRIPTION}`,
    '',
    'Bright Cave Digital is a digital growth studio offering three service',
    'tiers: DIY (Do It Yourself), DWY (Done With You), and DFY (Done For You).',
    '',
    '## Key pages',
    '',
    `- [Home](${SITE_URL}/): Overview of the DIY / DWY / DFY model.`,
    `- [About](${SITE_URL}/about): Who we are and how we work.`,
    `- [Services](${SITE_URL}/services): Details of each service tier.`,
    '',
    '## Blog',
    '',
    ...(posts.length
      ? posts.map(
          (p) => `- [${p.data.title}](${SITE_URL}/blog/${p.id}/): ${p.data.description}`
        )
      : ['- No posts published yet.']),
    '',
    '## Resources',
    '',
    ...(resources.length
      ? resources.map(
          (r) =>
            `- [${r.data.title}](${SITE_URL}/resources/${r.id}/): ${r.data.description}`
        )
      : ['- No resources published yet.']),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
