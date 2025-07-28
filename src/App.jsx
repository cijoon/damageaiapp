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
  const preloaderDelayAfterInitialLoad = 3000; // <<< YENİ EKLEDİK: Yükleme bittikten sonra 3 saniye gecikme
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`; // .webp uzantısını kullanmayı unutmayın!

  // images state'ini artık doğrudan Image nesneleri dizisi olarak değil,
  // her kare için bir Image nesnesi veya null/undefined içeren bir dizi olarak başlatıyoruz.
  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0; // Toplam yüklenen kare sayısı (initialFramesToLoad için)

    const preloadInitialFrames = async () => {
      const tempImages = [...images]; // Mevcut images dizisinin bir kopyası
      const initialImagePromises = []; // İlk karelerin yükleme sözleri

      for (let i = 0; i < initialFramesToLoad; i++) {
        if (isCancelled) return; // Yükleme iptal edildiyse dur

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img; // Yüklenen resmi doğru indekse yerleştir
              loadedCount++;
              setProgress(Math.round((loadedCount / initialFramesToLoad) * 100)); // Preloader sadece başlangıç karelerini gösterecek
            }
          });
        initialImagePromises.push(loadPromise);
      }

      // Tüm ilk karelerin (initialFramesToLoad) yüklenmesini bekle
      await Promise.all(initialImagePromises);

      if (!isCancelled) {
        setImages(tempImages); // İlk yüklenen kareleri state'e kaydet

        // <<< BURAYI DEĞİŞTİRDİK: Yeterli yükleme tamamlandıktan sonra gecikme ekle
        setTimeout(() => {
          if (!isCancelled) { // Zamanlayıcı tetiklendiğinde bile iptal edilip edilmediğini kontrol et
            setLoading(false); // Preloader'ı gecikmeden sonra kapat
          }
        }, preloaderDelayAfterInitialLoad); // Belirlenen gecikme süresi (örneğin 3 saniye)

        // Arka planda kalan resimleri yüklemeye hemen başla (gecikmeden etkilenmez)
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

        // Her bir kare yüklendikçe state'i güncelle
        if (!isCancelled) {
            setImages([...tempImages]); // Yeni bir dizi oluşturarak state güncellemesini tetikle
        }
      }
    };

    preloadInitialFrames();

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