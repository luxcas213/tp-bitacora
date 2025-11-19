'use client';

import { useState, useEffect } from 'react';

interface Charla {
  titulo: string;
  descripcion: string;
  reflexion?: string | null;
  preguntas?: string[];
  linkedin?: string | null;
  instagram?: string | null;
  web?: string | null;
}

interface BitacoraCarouselProps {
  charlas: Charla[];
}

export default function BitacoraCarousel({ charlas }: BitacoraCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLinks, setShowLinks] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % charlas.length);
      setShowLinks(false);
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + charlas.length) % charlas.length);
      setShowLinks(false);
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setDirection(index > currentIndex ? 'left' : 'right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setShowLinks(false);
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating]);

  const currentCharla = charlas[currentIndex];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with Thumbnails */}
      <header className="sticky top-4 z-50 px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border-2 border-[#E6E6E6] shadow-lg px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Home Button - Left */}
            <a
              href="/"
              className="shrink-0 w-10 h-10 rounded-lg bg-[#F7F7F7] hover:bg-[#E6E6E6] flex items-center justify-center transition-all border border-[#E6E6E6] group"
              aria-label="Volver al inicio"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>

            {/* Thumbnail Navigation - Centered */}
            <div className="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 items-center">
                {charlas.map((charla, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={isAnimating}
                    className={`shrink-0 rounded border-2 transition-all duration-300 disabled:opacity-50 ${
                      index === currentIndex
                        ? 'w-48 h-16 border-gray-900 bg-white shadow-sm'
                        : 'w-12 h-14 border-[#E6E6E6] bg-[#F0F0F0] hover:bg-[#E6E6E6] hover:w-16'
                    }`}
                  >
                    <div className="p-2 h-full flex flex-col overflow-hidden">
                      <div className={`text-xs font-mono transition-all ${
                        index === currentIndex ? 'text-gray-400 mb-1' : 'text-gray-500 text-center'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      {index === currentIndex && (
                        <h3 className="text-xs font-medium text-left line-clamp-2 text-gray-900">
                          {charla.titulo}
                        </h3>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Arrows - Fixed on sides */}
      <button
        onClick={goToPrev}
        disabled={isAnimating}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white hover:bg-[#F7F7F7] flex items-center justify-center transition-all border border-[#E6E6E6] shadow-lg hover:scale-110 disabled:opacity-50"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        disabled={isAnimating}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white hover:bg-[#F7F7F7] flex items-center justify-center transition-all border border-[#E6E6E6] shadow-lg hover:scale-110 disabled:opacity-50"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Slide - Full Screen with fixed height */}
      <div className="flex-1 flex items-center justify-center overflow-hidden py-8 px-4">
        <div 
          className={`bg-white rounded-lg border border-[#E6E6E6] p-8 md:p-12 shadow-sm w-full max-w-5xl h-[calc(100vh-180px)] flex flex-col transition-all duration-300 ${
            direction === 'left' ? 'animate-slideOutLeft' : 
            direction === 'right' ? 'animate-slideOutRight' : 
            'animate-slideIn'
          }`}
        >
          {/* Title - Fixed height */}
          <div className="shrink-0 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight line-clamp-2">
              {currentCharla.titulo}
            </h2>
            <div className="h-px bg-[#DCDCDC] mt-4" />
          </div>

          {/* Content - Fixed Grid Layout with flex-1 */}
          <div className="flex-1 overflow-hidden">
            {/* Fixed Grid Layout */}
            <div className="grid md:grid-cols-2 gap-6 h-full">
              {/* Left Column - Main content */}
              <div className="flex flex-col gap-4 h-full overflow-hidden">
                {/* Description - Takes 60% */}
                <div className="h-[60%] overflow-y-auto scrollbar-thin">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {currentCharla.descripcion}
                  </p>
                </div>

                {/* Reflexión - Takes 40% */}
                <div className="h-[40%] bg-[#F7F7F7] rounded-lg p-5 border border-[#E6E6E6] flex flex-col overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center justify-center gap-2 shrink-0">
                    Reflexión
                  </h3>
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {currentCharla.reflexion ? (
                      <p className="text-gray-700 text-sm italic leading-relaxed">
                        {currentCharla.reflexion}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm italic text-center">Sin reflexión registrada</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="flex flex-col gap-4 h-full overflow-hidden">
                {/* Preguntas - Takes 70% */}
                <div className="h-[70%] bg-[#F7F7F7] rounded-lg p-5 border border-[#E6E6E6] flex flex-col overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center justify-center gap-2 shrink-0">
                    Preguntas
                  </h3>
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {currentCharla.preguntas && currentCharla.preguntas.length > 0 ? (
                      <ul className="space-y-2.5">
                        {currentCharla.preguntas.map((pregunta, idx) => (
                          <li key={idx} className="text-gray-700 text-sm flex gap-2.5 leading-relaxed">
                            <span className="text-gray-400 font-bold shrink-0 mt-0.5">•</span>
                            <span>{pregunta}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm italic text-center">Sin preguntas registradas</p>
                    )}
                  </div>
                </div>

                {/* Social Links - Takes 30% */}
                <div className="h-[30%] bg-[#F7F7F7] rounded-lg p-5 border border-[#E6E6E6] flex items-center justify-center">
                  {(currentCharla.linkedin || currentCharla.instagram || currentCharla.web) ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {/* LinkedIn */}
                      {currentCharla.linkedin && (
                        <a
                          href={currentCharla.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group hover:scale-110 transition-transform"
                          title="LinkedIn"
                        >
                          <div className="w-14 h-14 bg-[#0A66C2] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                        </a>
                      )}

                      {/* Instagram */}
                      {currentCharla.instagram && (
                        <a
                          href={currentCharla.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group hover:scale-110 transition-transform"
                          title="Instagram"
                        >
                          <div className="w-14 h-14 bg-linear-to-br from-[#FED576] via-[#F47133] to-[#BC3081] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                        </a>
                      )}

                      {/* Website */}
                      {currentCharla.web && (
                        <a
                          href={currentCharla.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group hover:scale-110 transition-transform"
                          title="Sitio web"
                        >
                          <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">Sin enlaces</p>
                  )}
                </div>
                
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
