import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Blog posts: dated, author-attributed articles.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Bright Cave Digital'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    // Per-page social share image (falls back to the site default).
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Resources: guides, templates, and downloads. Optionally categorised by the
// DIY / DWY / DFY tier they best support.
const resources = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    resourceType: z
      .enum(['guide', 'template', 'checklist', 'tool', 'ebook'])
      .default('guide'),
    tier: z.enum(['DIY', 'DWY', 'DFY']).optional(),
    downloadUrl: z.string().url().optional(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, resources };
