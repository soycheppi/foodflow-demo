import React from 'react';
import { restaurantConfig } from '@/config/restaurant.config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  schema?: Record<string, unknown>;
}

const SEO: React.FC<SEOProps> = ({
  title = `${restaurantConfig.brand.name} | ${restaurantConfig.brand.tagline}`,
  description = restaurantConfig.brand.description,
  image = restaurantConfig.brand.ogImageUrl,
  url = typeof window !== 'undefined' ? window.location.href : '',
  schema,
}) => {
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurantConfig.brand.name,
    description: restaurantConfig.brand.description,
    image: restaurantConfig.brand.ogImageUrl,
    telephone: restaurantConfig.contact.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurantConfig.contact.address.street,
      addressLocality: restaurantConfig.contact.address.city,
      addressRegion: restaurantConfig.contact.address.state,
      postalCode: restaurantConfig.contact.address.postalCode,
      addressCountry: restaurantConfig.contact.address.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: restaurantConfig.business.openingHours.days,
        opens: restaurantConfig.business.openingHours.open,
        closes: restaurantConfig.business.openingHours.close,
      },
    ],
  };

  const finalSchema = schema || defaultSchema;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content={restaurantConfig.brand.primaryColor} />
      {url && <link rel="canonical" href={url} />}

      {}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={restaurantConfig.brand.name} />

      {}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
      />
    </>
  );
};

export default SEO;
