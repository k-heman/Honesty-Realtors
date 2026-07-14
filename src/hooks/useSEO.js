import { useEffect } from 'react';

export function useSEO({ title, description, url, image, schema }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
      setMeta('property', 'og:url', url);
    }
    
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
      setMeta('name', 'twitter:card', 'summary_large_image');
    }
    
    if (schema) {
      let script = document.querySelector('#seo-schema');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', 'seo-schema');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    return () => {
      const script = document.querySelector('#seo-schema');
      if (script) script.remove();
    };
  }, [title, description, url, image, schema]);
}

function setMeta(attr, key, content) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
