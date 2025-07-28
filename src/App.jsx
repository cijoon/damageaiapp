// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react'; // useRef kaldırıldı, artık kullanılmıyor
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
  // <<< DEĞİŞTİRİLDİ: Başlangıçta yüklenecek kare sayısı 40 olarak ayarlandı
  const initialFramesToLoad = 40;
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`;

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  // Önceki timer bazlı ilerleme ve ref'ler artık kullanılmıyor, kaldırıldı.

  useEffect(() => {
    let isCancelled = false;
    let loadedInitialCount = 0; // Başlangıç (ilk 40) kareleri için yüklenen sayacı

    const preloadInitialFrames = async () => {
      const tempImages = [...images]; // Mevcut images dizisinin bir kopyası
      const initialImagePromises = []; // Başlangıç karelerinin yükleme sözleri

      for (let i = 0; i < initialFramesToLoad; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        // Her resmin yüklenmesi ve çözümlenmesi (decode) için bir Promise oluştur
        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img; // Yüklenen ve çözümlenen resmi doğru indekse yerleştir
              loadedInitialCount++;
              // İlerleme çubuğu sadece başlangıç karelerinin yüklemesini yansıtacak (ilk 40 kareye göre %0-100)
              setProgress(Math.round((loadedInitialCount / initialFramesToLoad) * 100));
            }
          });
        initialImagePromises.push(loadPromise);
      }

      // Sadece başlangıç görsellerinin (ilk 40 kare) yüklenmesini/çözümlenmesini bekle
      await Promise.all(initialImagePromises);

      if (!isCancelled) {
        setImages(tempImages); // İlk yüklenen kareleri state'e kaydet
        setLoading(false); // <<< DEĞİŞTİRİLDİ: İlk 40 görsel yüklendikten sonra preloader'ı hemen kapat

        // Arka planda kalan resimleri yüklemeye başla
        preloadRemainingFrames(tempImages, loadedInitialCount);
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

        // Her bir kare yüklendikçe state'i güncelle (bu, ImageSequenceSection'ın resimleri almasını sağlar)
        if (!isCancelled) {
            setImages([...tempImages]); // Yeni bir dizi oluşturarak state güncellemesini tetikle
        }
      }
    };

    preloadInitialFrames(); // Başlangıç yükleme işlemini başlat

    // Bileşen unmount edildiğinde veya effect yeniden çalıştığında yüklemeyi iptal et
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