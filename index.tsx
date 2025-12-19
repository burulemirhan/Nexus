import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import ScrollToTop from './components/ScrollToTop';

// Lazy load service pages for code splitting
const EngineeringSolutions = lazy(() => import('./pages/EngineeringSolutions'));
const TurnkeyProjects = lazy(() => import('./pages/TurnkeyProjects'));
const DefenseProjects = lazy(() => import('./pages/DefenseProjects'));
const ConsultingProjectManagement = lazy(() => import('./pages/ConsultingProjectManagement'));

// Simple loading fallback
const PageLoader = () => (
  <div className="fixed inset-0 z-50 bg-nexus-dark flex items-center justify-center">
    <div className="text-white text-2xl font-tesla tracking-widest" style={{ fontFamily: 'Barlow' }}>NEXUS</div>
  </div>
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

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
            <Suspense fallback={<PageLoader />}>
              <EngineeringSolutions />
            </Suspense>
          </LanguageProvider>
        } />
        <Route path="/en/engineering-solutions" element={
          <LanguageProvider defaultLanguage="en">
            <Suspense fallback={<PageLoader />}>
              <EngineeringSolutions />
            </Suspense>
          </LanguageProvider>
        } />
        <Route path="/anahtar-teslim-projeler" element={
          <LanguageProvider defaultLanguage="tr">
            <Suspense fallback={<PageLoader />}>
              <TurnkeyProjects />
            </Suspense>
          </LanguageProvider>
        } />
        <Route path="/en/turnkey-projects" element={
          <LanguageProvider defaultLanguage="en">
            <Suspense fallback={<PageLoader />}>
              <TurnkeyProjects />
            </Suspense>
          </LanguageProvider>
        } />
        <Route path="/savunma-sanayi-projeleri" element={
          <LanguageProvider defaultLanguage="tr">
            <Suspense fallback={<PageLoader />}>
              <DefenseProjects />
            </Suspense>
          </LanguageProvider>
        } />
        <Route path="/en/defense-industry-projects" element={
          <LanguageProvider defaultLanguage="en">
            <Suspense fallback={<PageLoader />}>
              <DefenseProjects />
            </Suspense>
          </LanguageProvider>
        } />
        <Route path="/danışmanlık-ve-proje-yönetimi" element={
          <LanguageProvider defaultLanguage="tr">
            <Suspense fallback={<PageLoader />}>
              <ConsultingProjectManagement />
            </Suspense>
          </LanguageProvider>
        } />
        <Route path="/en/consulting-and-project-management" element={
          <LanguageProvider defaultLanguage="en">
            <Suspense fallback={<PageLoader />}>
              <ConsultingProjectManagement />
            </Suspense>
          </LanguageProvider>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);