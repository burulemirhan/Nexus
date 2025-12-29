import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import EngineeringSolutions from './pages/EngineeringSolutions';
import TurnkeyProjects from './pages/TurnkeyProjects';
import DefenseProjects from './pages/DefenseProjects';
import ConsultingProjectManagement from './pages/ConsultingProjectManagement';
import Team from './pages/Team';
import ScrollToTop from './components/ScrollToTop';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Theme-color verification (development only)
if (import.meta.env.DEV) {
  const themeColorMetas = Array.from(document.querySelectorAll('meta[name="theme-color"]'));
  const userAgent = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isChrome = userAgent.includes('Chrome');
  const isFirefox = userAgent.includes('Firefox');
  const browser = isChrome ? 'Chrome' : 
                  isSafari ? 'Safari' : 
                  isFirefox ? 'Firefox' : 'Unknown';
  
  const safariVersion = isSafari ? (userAgent.match(/Version\/(\d+)/)?.[1] || 'unknown') : null;
  const safariNote = isSafari && safariVersion && parseInt(safariVersion) >= 15 
    ? 'Safari 15+ supports theme-color. Ensure tab bar is in "Compact" layout (Preferences → Tabs).'
    : isSafari 
    ? `Safari ${safariVersion} - theme-color requires Safari 15+`
    : '';
  
  console.log('[theme-color] Verification:', {
    allThemeColorTags: themeColorMetas.map(m => m.outerHTML),
    count: themeColorMetas.length,
    userAgent,
    browser,
    safariVersion: safariVersion || 'N/A',
    notes: [
      safariNote,
      'Desktop Safari (15+): Works in Compact tab layout',
      'Mobile Safari: Works on iOS',
      'Android Chrome: Works on mobile',
      'Desktop Chrome: Limited support (mobile only)'
    ].filter(Boolean)
  });
}

// Get base path from environment or use default
const basePath = import.meta.env.BASE_URL || '/';

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basePath}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <LanguageProvider defaultLanguage="tr">
            <App />
          </LanguageProvider>
        } />
        <Route path="/en" element={
          <LanguageProvider defaultLanguage="en">
            <App />
          </LanguageProvider>
        } />
        <Route path="/mühendislik-çözümleri" element={
          <LanguageProvider defaultLanguage="tr">
            <EngineeringSolutions />
          </LanguageProvider>
        } />
        <Route path="/en/engineering-solutions" element={
          <LanguageProvider defaultLanguage="en">
            <EngineeringSolutions />
          </LanguageProvider>
        } />
        <Route path="/anahtar-teslim-projeler" element={
          <LanguageProvider defaultLanguage="tr">
            <TurnkeyProjects />
          </LanguageProvider>
        } />
        <Route path="/en/turnkey-projects" element={
          <LanguageProvider defaultLanguage="en">
            <TurnkeyProjects />
          </LanguageProvider>
        } />
        <Route path="/savunma-sanayi-projeleri" element={
          <LanguageProvider defaultLanguage="tr">
            <DefenseProjects />
          </LanguageProvider>
        } />
        <Route path="/en/defense-industry-projects" element={
          <LanguageProvider defaultLanguage="en">
            <DefenseProjects />
          </LanguageProvider>
        } />
        <Route path="/danışmanlık-ve-proje-yönetimi" element={
          <LanguageProvider defaultLanguage="tr">
            <ConsultingProjectManagement />
          </LanguageProvider>
        } />
        <Route path="/en/consulting-and-project-management" element={
          <LanguageProvider defaultLanguage="en">
            <ConsultingProjectManagement />
          </LanguageProvider>
        } />
        <Route path="/ekip" element={
          <LanguageProvider defaultLanguage="tr">
            <Team />
          </LanguageProvider>
        } />
        <Route path="/en/team" element={
          <LanguageProvider defaultLanguage="en">
            <Team />
          </LanguageProvider>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);