// DOSYA ADI: src/App.jsx

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
// import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx'; // LoadingScreen devre dışı bırakıldı

import Header from './components/Header';
import IntroSection from './components/IntroSection';
import ImageSequenceSection from './components/ImageSequenceSection'; // ImageSequenceSection'ı import et

// Diğer ağır bileşenleri lazy yüklüyoruz
const LazyPhilosophySection = lazy(() => import('./components/PhilosophySection/PhilosophySection'));
const LazyFinalCaseStudies = lazy(() => import('./components/FinalCaseStudies/FinalCaseStudies'));
const LazyPhoneShowcaseSection = lazy(() => import('./components/PhoneShowcaseSection'));
const LazyExperimentsSection = lazy(() => import('./components/ExperimentsSection'));
const LazyFooter = lazy(() => import('./components/Footer'));

import { DeviceProvider, useDevice } from "./contexts/DeviceContext"; // DeviceProvider import'ını kontrol ettik


// MainContent bileşeni - artık dışarıda koşullu render etmiyoruz,
// içindeki bileşenler kendi mobil render kararlarını verecek
// MainContent bileşeni
function MainContent({ images, onMobileStatusChange, onVideoReady, introSectionRef }) {
 const { isMobile } = useDevice();

 useEffect(() => {
   if (onMobileStatusChange) {
     onMobileStatusChange(isMobile);
   }
 }, [isMobile, onMobileStatusChange]);

 return (
   <>
     <Header />
     <main>
       <IntroSection onVideoReady={onVideoReady} ref={introSectionRef} />

       {!isMobile && (
         <Suspense fallback={<div>Loading philosophy...</div>}>
           <LazyPhilosophySection />
         </Suspense>
       )}

       <Suspense fallback={<div>Loading content...</div>}>
         <LazyFinalCaseStudies />
       </Suspense>

       {/* ImageSequenceSection burada */}
       {!isMobile && <ImageSequenceSection images={images} />}

       <Suspense fallback={<div>Loading showcase...</div>}>
         <LazyPhoneShowcaseSection />
       </Suspense>

       <Suspense fallback={<div>Loading experiments...</div>}>
         <LazyExperimentsSection />
       </Suspense>

       <Suspense fallback={<div>Loading footer...</div>}>
         <LazyFooter />
       </Suspense>
     </main>
   </>
 );
}


export default function App() {
  const totalFrames = 135;
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}_result.webp`;


  const [preloadedImageSequenceImages, setPreloadedImageSequenceImages] = useState(Array(totalFrames).fill(null));
  // const [imageSequenceLoadProgress, setImageSequenceLoadProgress] = useState(0); // Loading screen kalktığı için progress tutmaya gerek yok

  // const [showLoadingScreen, setShowLoadingScreen] = useState(true); // Loading screen kalktığı için kaldırıldı
  const [isMobileDetected, setIsMobileDetected] = useState(false); // Mobile algılama state'i

  const mainVideoRef = useRef(null);
  const introSectionMainRef = useRef(null);

  const handleMobileStatusChange = (status) => {
    setIsMobileDetected(status);
  };

  const handleMainVideoReady = (videoElement) => {
    mainVideoRef.current = videoElement;
    if (mainVideoRef.current) {
      // Mobilde video anında oynatılabilir olmalı, otomatik oynatma denemesi
      // Masaüstünde ise hala intro video manuel kontrol edilebilir.
      if (isMobileDetected) {
          const playPromise = mainVideoRef.current.play();
          if (playPromise !== undefined) {
              playPromise.then(() => {
                  // Video başarıyla oynatılmaya başlandı
              }).catch(error => {
                  // Otomatik oynatma engellendi, kullanıcı etkileşimi gerekebilir
                  console.warn("Mobilde video otomatik oynatılamadı, kullanıcı etkileşimi gerekebilir:", error);
              });
          }
      } else {
        mainVideoRef.current.pause();
        mainVideoRef.current.currentTime = 0;
      }
    }
  };

  useEffect(() => {
    // Mobil veya masaüstü fark etmeksizin, ImageSequenceSection resimlerini arkada yükle.
    // Artık loading ekranı olmadığı için, bu yükleme işlemi tamamen arkaplanda olacak.
    // Yalnızca isMobileDetected false (masaüstü) ise ImageSequenceSection render edilecek,
    // ancak preload işlemi her zaman başlatılabilir.

    let isCancelled = false;
    let loadedCount = 0;

    const preloadImageSequenceAssets = async () => {
      const tempImages = Array(totalFrames).fill(null);
      const imageLoadPromises = [];

      for (let i = 0; i < totalFrames; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => {
            if (!isCancelled) {
              tempImages[i] = img;
              loadedCount++;
              // setImageSequenceLoadProgress(Math.floor((loadedCount / totalFrames) * 100)); // Loading screen yok
              resolve();
            } else {
              reject(new Error("Yükleme iptal edildi"));
            }
          };
          img.onerror = (e) => {
            console.error(`Resim yüklenirken hata: ${img.src}`, e);
            if (!isCancelled) {
               tempImages[i] = null;
               loadedCount++;
               // setImageSequenceLoadProgress(Math.floor((loadedCount / totalFrames) * 100)); // Loading screen yok
               resolve();
            } else {
               reject(new Error("Yükleme iptal edildi"));
            }
          };
        });
        imageLoadPromises.push(loadPromise);
      }

      await Promise.allSettled(imageLoadPromises);

      if (!isCancelled) {
        setPreloadedImageSequenceImages(tempImages);
        // setShowLoadingScreen(false); // Loading screen yok
      }
    };

    // Siteye girildiğinde preload işlemini başlat (mobil olup olmadığına bakılmaksızın)
    // Ancak App'teki isMobileDetected state'ini useEffect bağımlılıklarına eklemeyelim,
    // çünkü preload'un sadece bir kez başlamasını istiyoruz.
    preloadImageSequenceAssets();

    return () => {
      isCancelled = true;
    };
  }, []); // Bağımlılık dizisi boş, bu useEffect sadece bir kez çalışacak.

  // handleLoadingScreenComplete artık loading screen olmadığı için gereksiz.
  // Onun yerine, video hazır olduğunda veya mobilse otomatik oynatma mantığı handleMainVideoReady'ye taşındı.

  return (
    <DeviceProvider>
      {/* LoadingScreen tamamen kaldırıldı */}
      {/* {!isMobileDetected && showLoadingScreen && (
        <LoadingScreen
          onLoadingComplete={handleLoadingScreenComplete}
          progress={imageSequenceLoadProgress}
        />
      )} */}

      {/* MainContent her zaman render ediliyor */}
      <MainContent
        images={preloadedImageSequenceImages}
        onMobileStatusChange={handleMobileStatusChange}
        onVideoReady={handleMainVideoReady}
        introSectionRef={introSectionMainRef}
      />
    </DeviceProvider>
  );
}