import { getCollection } from 'astro:content';

// Collections that must contain at least one entry for the build to be valid.
//
// A collection that loads zero entries usually means the content pipeline is
// broken rather than that the directory is empty: the files can be present on
// disk yet never enter the content store (for example when the loader has no
// renderer for their extension, as happens for .mdx without @astrojs/mdx). We
// assert length > 0 so that condition aborts the build instead of silently
// shipping empty content.
//
// 'exclusives' is intentionally excluded because it has no content yet. Add it
// to this set once at least one exclusive exists.
const EXPECT_NON_EMPTY = ['atoms', 'lenses', 'notices', 'guides'] as const;

export async function assertContentInvariants(): Promise<void> {
  const empty: string[] = [];
  for (const name of EXPECT_NON_EMPTY) {
    const entries = await getCollection(name);
    if (entries.length === 0) empty.push(name);
  }
  if (empty.length > 0) {
    throw new Error(
      `Content invariant failed: collection(s) [${empty.join(', ')}] loaded 0 ` +
        `entries but are declared non-empty. The files may exist on disk yet ` +
        `never entered the content store — check that the loader/renderer for ` +
        `their file type is installed (e.g. @astrojs/mdx for .mdx). Build ` +
        `aborted to avoid shipping empty content.`
    );
  }
}
