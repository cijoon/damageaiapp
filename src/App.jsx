// DOSYA ADI: src/App.jsx

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

import Header from './components/Header';
import IntroSection from './components/IntroSection';
import ImageSequenceSection from './components/ImageSequenceSection';

// Diğer ağır bileşenleri lazy yüklüyoruz
const LazyPhilosophySection = lazy(() => import('./components/PhilosophySection/PhilosophySection'));
const LazyFinalCaseStudies = lazy(() => import('./components/FinalCaseStudies/FinalCaseStudies'));
const LazyPhoneShowcaseSection = lazy(() => import('./components/PhoneShowcaseSection'));
const LazyExperimentsSection = lazy(() => import('./components/ExperimentsSection'));
const LazyFooter = lazy(() => import('./components/Footer'));

import { DeviceProvider, useDevice } from "./contexts/DeviceContext";


// MainContent bileşeni (DEĞİŞİKLİK YOK - Daha önceki son halini kullanıyoruz)
function MainContent({ images, onMobileStatusChange, onVideoReady, introSectionRef }) {
 const { isMobile } = useDevice(); // MainContent hala isMobile'ı kendi içinde kullanıyor

 useEffect(() => {
   // Bu callback artık AppContent'teki isMobileDetected state'ini güncellemeyecek
   // MainContent içinde DeviceContext'ten isMobile'ı kullanmak yeterli.
   // Eğer App'e (şimdiki AppContent'e) isMobile bilgisini taşımak istenseydi, bu callback kullanılabilirdi.
   // Ancak şu anki yapıda AppContent doğrudan useDevice'ı kullandığı için buna gerek kalmıyor.
   if (onMobileStatusChange) { // Eğer bir dış bileşene mobil durumu bildirmek gerekirse kalabilir.
     onMobileStatusChange(isMobile); // Şimdiki AppContent için bu artık gerekli değil, silinebilir
   }
 }, [isMobile, onMobileStatusChange]); // onMobileStatusChange prop'u artık AppContent'ten gelmiyor

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


// YENİ: Uygulamanın ana mantığını içeren bileşen
function AppContent() {
  // useDevice hook'unu burada doğrudan kullanabiliriz çünkü DeviceProvider üstte sarıyor.
  const { isMobile } = useDevice(); // Mobil durumunu buradan alıyoruz

  const totalFrames = 135;
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}_result.webp`;


  const [preloadedImageSequenceImages, setPreloadedImageSequenceImages] = useState(Array(totalFrames).fill(null));
  // isMobileDetected state'i artık gerekli değil, isMobile doğrudan kullanılıyor.
  // const [isMobileDetected, setIsMobileDetected] = useState(false);

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  const mainVideoRef = useRef(null);
  const introSectionMainRef = useRef(null);

  // handleMobileStatusChange callback'i AppContent'e taşındığı için gerek kalmadı.
  // const handleMobileStatusChange = (status) => {
  //   setIsMobileDetected(status);
  // };

  const handleMainVideoReady = (videoElement) => {
    mainVideoRef.current = videoElement;
    if (mainVideoRef.current) {
      // isMobileDetected yerine doğrudan isMobile kullanılıyor
      if (isMobile) {
          const playPromise = mainVideoRef.current.play();
          if (playPromise !== undefined) {
              playPromise.then(() => {
                  // Video başarıyla oynatılmaya başlandı
              }).catch(error => {
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
      }
    };

    preloadImageSequenceAssets();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Yükleme ekranı zamanlayıcısı: sadece mobil değilse çalışacak
  useEffect(() => {
    if (!isMobile) { // Sadece masaüstü ise 3 saniyelik zamanlayıcıyı başlat
        const timer = setTimeout(() => {
            setShowLoadingScreen(false);
        }, 3000);
        return () => clearTimeout(timer);
    } else {
        // Mobil ise, yükleme ekranını hemen gizle (hiç gösterme)
        setShowLoadingScreen(false);
    }
  }, [isMobile]); // isMobile bağımlılığı, mobil durum değiştiğinde (ilk tespit edildiğinde) tetikler


  return (
    <>
      {/* Yükleme ekranı sadece showLoadingScreen true VE mobil değilse render edilecek */}
      {showLoadingScreen && !isMobile && <LoadingScreen />}

      {/* Ana içerik, showLoadingScreen false olduğunda render edilecek.
          Mobil ise, showLoadingScreen hemen false olacağı için MainContent anında görünür.
          Masaüstü ise, 3 saniye sonra MainContent görünür. */}
      {!showLoadingScreen && (
        <MainContent
          images={preloadedImageSequenceImages}
          // onMobileStatusChange prop'u artık AppContent'ten gönderilmiyor
          onVideoReady={handleMainVideoReady}
          introSectionRef={introSectionMainRef}
        />
      )}
    </>
  );
}

// Orijinal App export'u şimdi DeviceProvider'ı sarıyor
export default function App() {
  return (
    <DeviceProvider>
      <AppContent /> {/* Tüm uygulama mantığı burada */}
    </DeviceProvider>
  );
}