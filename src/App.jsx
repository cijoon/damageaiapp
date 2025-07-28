// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import IntroSection from './components/IntroSection';
import PhilosophySection from './components/PhilosophySection/PhilosophySection';
import FinalCaseStudies from './components/FinalCaseStudies/FinalCaseStudies';
import PhoneShowcaseSection from './components/PhoneShowcaseSection';
import ImageSequenceSection from './components/ImageSequenceSection';
import ExperimentsSection from './components/ExperimentsSection';
import Footer from './components/Footer';
import { DeviceProvider, useDevice } from "./contexts/DeviceContext";

function MainContent({ images, loading, progress }) {
  const { isMobile } = useDevice();
  if (loading && !isMobile) {
    return <Preloader progress={progress} />;
  }
  return (
    <>
      <Header />
      <main>
        <IntroSection />
        {!isMobile && <ImageSequenceSection images={images} />}
        <FinalCaseStudies />
        {/* Mobilde PhilosophySection gösterilmeyecek */}
        {!isMobile && <PhilosophySection />}
        <PhoneShowcaseSection />
        <ExperimentsSection />
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  const totalFrames = 135;
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;

    const preload = async () => {
      const loadedImages = [];
      for (let i = 0; i < totalFrames; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        // decode() bazı tarayıcılarda hata atabilir; güvenli yakala
        try {
          await img.decode();
        } catch (_) {
          // ignore decode error; yine de push et
        }

        loadedImages.push(img);

        // progress güncelle
        const pct = ((i + 1) / totalFrames) * 100;
        setProgress(pct);
      }

      if (!isCancelled) {
        setImages(loadedImages);
        setLoading(false);
      }
    };

    preload();

    return () => {
      isCancelled = true;
    };
  }, []); // yalnızca ilk mount

  return (
    <DeviceProvider>
      <MainContent images={images} loading={loading} progress={progress} />
    </DeviceProvider>
  );
}
