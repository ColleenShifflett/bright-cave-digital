// Dynamically generated llms.txt (https://llmstxt.org/) describing the site for
// LLM agents. Generating it means the post listing stays current.
import type { APIRoute } from 'astro';
import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from '../consts';
import { AREAS } from '../data/areas';
import { getPublishedPosts, postUrl } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();

  const lines = [
    `# ${SITE_TITLE}`,
    '',
    `> ${SITE_TAGLINE} ${SITE_DESCRIPTION}`,
    '',
    'Bright Cave Digital is a web analytics and web strategy practice for the',
    'AI era, founded by Colleen Shifflett. Work covers three areas, each with a',
    'free diagnostic. Most clients follow one program: a free diagnostic and',
    'discovery call, a half-day workshop, guided implementation, and optional',
    'check-ins.',
    '',
    '## Areas',
    '',
    ...AREAS.map(
      (a) => `- [${a.name}](${SITE_URL}/${a.slug}): ${a.diagnostic}. ${a.problem}`
    ),
    '',
    '## Key pages',
    '',
    `- [Home](${SITE_URL}/): What we do and how it works.`,
    `- [Services](${SITE_URL}/services): The program, custom projects, and freelance engagements.`,
    `- [Resources](${SITE_URL}/resources/): Posts on web analytics, web strategy, and AI strategy.`,
    `- [About](${SITE_URL}/about): Background, beliefs, and how we work.`,
    `- [Contact](${SITE_URL}/contact): Book a discovery call or request a diagnostic.`,
    '',
    '## Posts',
    '',
    ...(posts.length
      ? posts.map((p) => `- [${p.data.title}](${SITE_URL}${postUrl(p)}): ${p.data.description}`)
      : ['- No posts published yet.']),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
