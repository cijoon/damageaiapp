// DOSYA ADI: src/components/Preloader.jsx
// Arka plan görseli (public/loading.png) + sağ altta yüzde gösterir.
// Başka hiçbir şey yapmaz.

import React from "react";

export default function Preloader({ progress = 0 }) {
  // En az %2 göster (isteğin üzerine)
  const displayPercent = Math.max(2, Math.min(100, Math.floor(progress)));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/loading.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "30px",
          fontSize: "2.5rem",
          color: "#ffffff",
          fontFamily: "monospace",
          textShadow: "0 0 10px rgba(0,0,0,0.5)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        %{displayPercent}
      </div>
    </div>
  );
}
