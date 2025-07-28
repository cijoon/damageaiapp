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
  const initialFramesToLoad = 20; // İlk yüklenecek kare sayısı
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`; // .webp uzantısını kullanmayı unutmayın!

  // images state'ini artık doğrudan Image nesneleri dizisi olarak değil,
  // her kare için bir Image nesnesi veya null/undefined içeren bir dizi olarak başlatıyoruz.
  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0; // Toplam yüklenen kare sayısı

    const preloadInitialFrames = async () => {
      const tempImages = [...images]; // Mevcut images dizisinin bir kopyası

      for (let i = 0; i < initialFramesToLoad; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        try {
          await img.decode();
        } catch (_) {
          // Hata durumunda bile push et, resim bozuksa bile yer tutsun
        }

        tempImages[i] = img; // Yüklenen resmi doğru indekse yerleştir
        loadedCount++;
        setProgress(Math.round((loadedCount / initialFramesToLoad) * 100)); // Preloader sadece başlangıç karelerini gösterecek
      }

      if (!isCancelled) {
        setImages(tempImages); // İlk yüklenen kareleri state'e kaydet
        setLoading(false); // Preloader'ı kapat

        // Arka planda kalan resimleri yüklemeye başla
        preloadRemainingFrames(tempImages, loadedCount);
      }
    };

    const preloadRemainingFrames = async (currentImages, startingLoadedCount) => {
      const tempImages = [...currentImages]; // Güncel images dizisinin bir kopyası

      for (let i = startingLoadedCount; i < totalFrames; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        try {
          await img.decode();
        } catch (_) {
          // Hata durumunda bile yer tutsun
        }

        tempImages[i] = img; // Yüklenen resmi doğru indekse yerleştir

        // Her bir kare yüklendikçe state'i güncelle (performans için batching yapabiliriz, şimdilik bu şekilde)
        // Çok sık re-render'ı engellemek için her karede setImages yerine, belli aralıklarla veya sonda bir kez setImages yapmayı düşünebilirsiniz.
        // Ancak bu örnekte her yüklenen karede güncelliyoruz ki ImageSequenceSection onu kullanabilsin.
        if (!isCancelled) {
            setImages([...tempImages]); // Yeni bir dizi oluşturarak state güncellemesini tetikle
        }
      }
    };

    preloadInitialFrames();

    return () => {
      isCancelled = true;
    };
  }, []); // Yalnızca ilk mount

  return (
    <DeviceProvider>
      <MainContent images={images} loading={loading} progress={progress} />
    </DeviceProvider>
  );
}