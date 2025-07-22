// DOSYA ADI: App.jsx
// Yeni animasyon bölümü eklendi.

import React from 'react';
import Header from './components/Header';
import IntroSection from './components/IntroSection';
import PhilosophySection from './components/PhilosophySection/PhilosophySection';
import FinalCaseStudies from './components/FinalCaseStudies/FinalCaseStudies';
import PhoneShowcaseSection from './components/PhoneShowcaseSection';
import ImageSequenceSection from './components/ImageSequenceSection'; // YENİ İMPORT
import ExperimentsSection from './components/ExperimentsSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <IntroSection />
        <ImageSequenceSection /> {/* YENİ BÖLÜM BURADA */}        
        <FinalCaseStudies />
        <PhilosophySection />
        <PhoneShowcaseSection />
        <ExperimentsSection />
        <Footer />
      </main>
    </>
  );
}