// Dynamically generated llms.txt (https://llmstxt.org/) describing the site for
// LLM agents. Generating it means the blog/resource listings stay current.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from '../consts';
import { STAGES } from '../data/stages';

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
    'Bright Cave Digital is an AI-era web strategy and analytics practice',
    'founded by Colleen Shifflett. Work is organized as six stages. At each',
    'stage the client chooses how hands-on to be: do it yourself (DIY), do it',
    'with us (DWY), or have us do it (DFY).',
    '',
    '## Key pages',
    '',
    `- [Home](${SITE_URL}/): Overview, the free scorecard, and the six stages.`,
    `- [Scorecard](${SITE_URL}/scorecard): Free website discoverability scorecard.`,
    `- [Services](${SITE_URL}/services): The six stages and add-ons.`,
    `- [Work with us](${SITE_URL}/work-with-us): What is open now and the waiting list.`,
    `- [Core beliefs](${SITE_URL}/core-beliefs): What we believe about websites in the AI era.`,
    `- [Approach](${SITE_URL}/approach): Six working principles.`,
    `- [About](${SITE_URL}/about): Background and experience.`,
    `- [Fixing it in public](${SITE_URL}/fixing-it-in-public): Our own scorecard results over time.`,
    `- [Now](${SITE_URL}/now): Current focus and capacity.`,
    '',
    '## Stages',
    '',
    ...STAGES.map(
      (s) => `- [${s.name}: ${s.subtitle}](${SITE_URL}/services/${s.slug}): ${s.line}`
    ),
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
