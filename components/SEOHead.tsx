import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOHeadProps {
  titleKey?: string;
  descriptionKey?: string;
  image?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  titleKey,
  descriptionKey,
  image = '/og-image.png'
}) => {
  const { t, language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language === 'en' ? 'en' : 'tr';

    // Get translated values
    const baseTitle = 'NEXUS';
    const suffix = language === 'en' 
      ? 'Advanced Agricultural Engineering' 
      : 'İleri Tarım Mühendisliği';
    
    const pageTitle = titleKey 
      ? `${t(titleKey)} | ${baseTitle}` 
      : `${baseTitle} | ${suffix}`;
    
    const description = descriptionKey 
      ? t(descriptionKey)
      : language === 'en'
        ? 'Nexus provides controlled environment agriculture solutions that push the limits of efficiency in agricultural production.'
        : 'Nexus, dikey tarım, kontrollü sera sistemleri ve açık arazi otonomisi ile tarımsal üretimde verimlilik limitlerini zorlayan mühendislik çözümleri sunar.';

    // Update document title
    document.title = pageTitle;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('og:title', pageTitle);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', `https://nexusbiotech.org${image}`);
    updateMetaTag('og:url', `https://nexusbiotech.org${location.pathname}`);
    updateMetaTag('og:locale', language === 'en' ? 'en_US' : 'tr_TR');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `https://nexusbiotech.org${image}`);

    // Update canonical URL
    updateLinkTag('canonical', `https://nexusbiotech.org${location.pathname}`);

    // Update alternate language links
    const trPath = getAlternatePath(location.pathname, 'tr');
    const enPath = getAlternatePath(location.pathname, 'en');
    updateAlternateLinks(trPath, enPath);

  }, [titleKey, descriptionKey, image, t, language, location.pathname]);

  return null;
};

function updateMetaTag(name: string, content: string) {
  // Try property first (for og: and twitter: tags)
  let element = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    // Try name attribute
    element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  }
  
  if (element) {
    element.content = content;
  } else {
    // Create new meta tag
    const meta = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    meta.content = content;
    document.head.appendChild(meta);
  }
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (element) {
    element.href = href;
  } else {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  }
}

function updateAlternateLinks(trPath: string, enPath: string) {
  // Remove existing alternate links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  
  // Add Turkish alternate
  const trLink = document.createElement('link');
  trLink.rel = 'alternate';
  trLink.hreflang = 'tr';
  trLink.href = `https://nexusbiotech.org${trPath}`;
  document.head.appendChild(trLink);
  
  // Add English alternate
  const enLink = document.createElement('link');
  enLink.rel = 'alternate';
  enLink.hreflang = 'en';
  enLink.href = `https://nexusbiotech.org${enPath}`;
  document.head.appendChild(enLink);
  
  // Add x-default (defaults to Turkish)
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `https://nexusbiotech.org${trPath}`;
  document.head.appendChild(defaultLink);
}

function getAlternatePath(currentPath: string, targetLang: 'tr' | 'en'): string {
  const pathMappings: Record<string, { tr: string; en: string }> = {
    '/': { tr: '/', en: '/en' },
    '/en': { tr: '/', en: '/en' },
    '/mühendislik-çözümleri': { tr: '/mühendislik-çözümleri', en: '/en/engineering-solutions' },
    '/en/engineering-solutions': { tr: '/mühendislik-çözümleri', en: '/en/engineering-solutions' },
    '/anahtar-teslim-projeler': { tr: '/anahtar-teslim-projeler', en: '/en/turnkey-projects' },
    '/en/turnkey-projects': { tr: '/anahtar-teslim-projeler', en: '/en/turnkey-projects' },
    '/savunma-sanayi-projeleri': { tr: '/savunma-sanayi-projeleri', en: '/en/defense-industry-projects' },
    '/en/defense-industry-projects': { tr: '/savunma-sanayi-projeleri', en: '/en/defense-industry-projects' },
    '/danışmanlık-ve-proje-yönetimi': { tr: '/danışmanlık-ve-proje-yönetimi', en: '/en/consulting-and-project-management' },
    '/en/consulting-and-project-management': { tr: '/danışmanlık-ve-proje-yönetimi', en: '/en/consulting-and-project-management' },
  };

  const decodedPath = decodeURIComponent(currentPath);
  const mapping = pathMappings[decodedPath] || pathMappings[currentPath];
  
  if (mapping) {
    return mapping[targetLang];
  }
  
  // Default fallback
  return targetLang === 'en' ? '/en' : '/';
}

export default SEOHead;
