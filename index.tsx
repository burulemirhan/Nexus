import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import EngineeringSolutions from './pages/EngineeringSolutions';
import TurnkeyProjects from './pages/TurnkeyProjects';
import DefenseProjects from './pages/DefenseProjects';
import ConsultingProjectManagement from './pages/ConsultingProjectManagement';
import ScrollToTop from './components/ScrollToTop';

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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);