// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react';
// import Preloader from './components/Preloader'; // Preloader kaldırıldı
import Header from './components/Header';
import IntroSection from './components/IntroSection';
import PhilosophySection from './components/PhilosophySection/PhilosophySection';
import FinalCaseStudies from './components/FinalCaseStudies/FinalCaseStudies';
import PhoneShowcaseSection from './components/PhoneShowcaseSection';
import ImageSequenceSection from './components/ImageSequenceSection';
import ExperimentsSection from './components/ExperimentsSection';
import Footer from './components/Footer';
import { DeviceProvider, useDevice } from "./contexts/DeviceContext";

// MainContent bileşenindeki loading ve progress props'ları kaldırıldı
function MainContent({ images }) { // Props güncellendi
  const { isMobile } = useDevice();
  // Preloader kaldırıldığı için bu koşul kaldırıldı
  // if (loading && !isMobile) {
  //   return <Preloader progress={progress} />;
  // }
  return (
    <>
      <Header />
      <main>
        <IntroSection />
        {/* Sadece mobilde değilse ImageSequenceSection'ı göster - Kullanıcının istediği sıraya göre düzenlendi */}
        {!isMobile && <ImageSequenceSection images={images} />}
        <FinalCaseStudies />
        {/* Mobilde PhilosophySection gösterilmeyecek - Kullanıcının istediği sıraya göre düzenlendi */}
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
  // <<< DEĞİŞTİRİLDİ: imagePath fonksiyonu "Pre-comp 1_00134.webp" formatına döndürüldü
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`;

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  // <<< KALDIRILDI: loading ve progress state'leri kaldırıldı
  // const [loading, setLoading] = useState(true);
  // const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0; // Toplam yüklenen kare sayısı

    const preloadAllFrames = async () => {
      const tempImages = Array(totalFrames).fill(null);
      const imageLoadPromises = [];

      for (let i = 0; i < totalFrames; i++) { // Tüm kareler için döngü
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img;
              loadedCount++;
              // <<< KALDIRILDI: setProgress çağrısı kaldırıldı
              // setProgress(Math.round((loadedCount / totalFrames) * 100));
            }
          });
        imageLoadPromises.push(loadPromise);
      }

      // Tüm görsellerin yüklenmesini/çözümlenmesini bekle
      await Promise.all(imageLoadPromises);

      if (!isCancelled) {
        setImages(tempImages);
        // <<< KALDIRILDI: setLoading çağrısı kaldırıldı
        // setLoading(false); // Tüm görseller yüklendikten sonra preloader'ı kapat
      }
    };

    preloadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []); // Sadece ilk mount

  return (
    <DeviceProvider>
      {/* <<< DEĞİŞTİRİLDİ: MainContent'e loading ve progress props'ları geçirilmiyor */}
      <MainContent images={images} />
    </DeviceProvider>
  );
}