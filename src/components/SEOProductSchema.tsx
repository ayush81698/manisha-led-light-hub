
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/data/products';

interface SEOProductSchemaProps {
  product: Product;
}

const SEOProductSchema: React.FC<SEOProductSchemaProps> = ({ product }) => {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url || (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'),
    brand: {
      '@type': 'Brand',
      name: 'Manisha Enterprises',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Manisha Enterprises',
    },
    offers: {
      '@type': 'Offer',
      availability: product.is_active ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: product.price || '0',
      priceCurrency: 'INR',
    },
    itemCondition: 'https://schema.org/NewCondition',
  };

  return (
    <Helmet>
      <title>{`${product.name} - LED Light Housing | Manisha Enterprises`}</title>
      <meta name="description" content={`${product.description?.substring(0, 150) || 'Premium quality'} - ${product.wattage}W ${product.shape} LED light housing for ${product.specifications?.usage_application || 'commercial and residential applications'}`} />
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

export default SEOProductSchema;
