// Builders for schema.org structured data used with the <JsonLd> component.
import { SITE_URL, SITE_DESCRIPTION, ORGANIZATION } from '../consts';

/** Organization schema — render this once, sitewide (in the base layout). */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: SITE_URL,
    logo: ORGANIZATION.logo,
    description: SITE_DESCRIPTION,
    email: ORGANIZATION.email,
    sameAs: ORGANIZATION.sameAs,
  };
}

interface ArticleInput {
  title: string;
  description: string;
  url: string | URL;
  image: string | URL;
  publishedTime: Date;
  modifiedTime?: Date;
  author: string;
}

/** Article schema — render on each blog post / resource detail page. */
export function articleSchema(input: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: input.image.toString(),
    datePublished: input.publishedTime.toISOString(),
    dateModified: (input.modifiedTime ?? input.publishedTime).toISOString(),
    author: {
      '@type': 'Person',
      name: input.author,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url.toString(),
    },
  };
}
