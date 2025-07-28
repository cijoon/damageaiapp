// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import IntroSection from './components/Introloader';
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
        {/* Sadece mobilde değilse ImageSequenceSection'ı göster */}
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
  // initialFramesToLoad kaldırıldı, çünkü artık tüm 135 kareyi baştan yükleyeceğiz.
  // preloaderMinimumDisplayTime (3 saniye gecikme) özelliği kaldırıldı.
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`;

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;

    const preloadAllFrames = async () => { // Fonksiyon adını preloadAllFrames olarak değiştirdik
      const tempImages = Array(totalFrames).fill(null); // Tüm kareler için boş bir dizi oluştur
      const imageLoadPromises = [];
      let loadedCount = 0;

      for (let i = 0; i < totalFrames; i++) { // <<< DEĞİŞTİRİLDİ: Tüm 135 kareyi yükle
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        // Her resmin yüklenmesi ve çözümlenmesi (decode) için bir Promise oluştur
        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img; // Yüklenen ve çözümlenen resmi doğru indekse yerleştir
              loadedCount++;
              // İlerleme çubuğu tüm karelerin yüklemesini yansıtacak (135 kare için)
              setProgress(Math.round((loadedCount / totalFrames) * 100));
            }
          });
        imageLoadPromises.push(loadPromise);
      }

      // <<< DEĞİŞTİRİLDİ: Sadece tüm 135 görselin yüklenmesini/çözümlenmesini bekle
      await Promise.all(imageLoadPromises);

      if (!isCancelled) {
        setImages(tempImages); // Tüm yüklenen ve çözümlenen kareleri state'e kaydet
        setLoading(false); // Preloader'ı hemen kapat
      }
    };

    preloadAllFrames(); // Tüm kareleri yükleme işlemini başlat

    return () => {
      isCancelled = true; // Bileşen unmount edildiğinde veya effect yeniden çalıştığında yüklemeyi iptal et
    };
  }, []); // Yalnızca ilk mount

  return (
    <DeviceProvider>
      <MainContent images={images} loading={loading} progress={progress} />
    </DeviceProvider>
  );
}