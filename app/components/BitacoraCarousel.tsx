'use client';

import { useState, useEffect, useRef } from 'react';

interface PreguntaRespuesta {
  pregunta: string;
  respuesta: string;
}

interface Charla {
  titulo: string;
  descripcion: string;
  reflexion?: string | null;
  preguntas_respuestas?: PreguntaRespuesta[];
  linkedin?: string | null | Record<string, string>;
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const imageRotationInterval = useRef<NodeJS.Timeout | null>(null);

  // Load available images for current charla
  useEffect(() => {
    const loadImages = async () => {
      const charlaNumber = currentIndex + 1;
      
      try {
        // Fetch images from the API route
        const response = await fetch(`/api/images/${charlaNumber}`);
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
          setAvailableImages(data.images);
        } else {
          // Fallback: try default pattern if API fails
          setAvailableImages([`/img/${charlaNumber}/${charlaNumber}.png`]);
        }
      } catch (error) {
        console.error('Error loading images:', error);
        // Fallback to default pattern
        setAvailableImages([`/img/${charlaNumber}/${charlaNumber}.png`]);
      }
      
      setCurrentImageIndex(0);
    };
    
    loadImages();
  }, [currentIndex]);

  // Auto-rotate images with fade effect
  useEffect(() => {
    if (availableImages.length <= 1) return;
    
    // Clear existing interval
    if (imageRotationInterval.current) {
      clearInterval(imageRotationInterval.current);
    }
    
    // Set new interval to rotate images every 4 seconds
    imageRotationInterval.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
    }, 4000);
    
    return () => {
      if (imageRotationInterval.current) {
        clearInterval(imageRotationInterval.current);
      }
    };
  }, [availableImages]);

  const goToNext = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % charlas.length);
      setShowLinks(false);
      setIsDescriptionExpanded(false);
      setIsQuestionsExpanded(false);
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
      setIsDescriptionExpanded(false);
      setIsQuestionsExpanded(false);
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
      setIsDescriptionExpanded(false);
      setIsQuestionsExpanded(false);
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

  // Auto scroll to active thumbnail
  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[currentIndex];
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) {
      // Swipe left - go to next
      goToNext();
    }
    
    if (touchStartX.current - touchEndX.current < -75) {
      // Swipe right - go to previous
      goToPrev();
    }
  };

  const currentCharla = charlas[currentIndex];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with Thumbnails */}
      <header className="sticky top-1 sm:top-4 z-50 px-1 sm:px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-2xl border border-[#E6E6E6] sm:border-2 shadow-md sm:shadow-lg px-1.5 sm:px-4 md:px-6 py-1.5 sm:py-3 md:py-4">
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            {/* Home Button - Left */}
            <a
              href="/"
              className="shrink-0 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded sm:rounded-lg bg-[#F7F7F7] hover:bg-[#E6E6E6] flex items-center justify-center transition-all border border-[#E6E6E6] group"
              aria-label="Volver al inicio"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>

            {/* Thumbnail Navigation - Centered */}
            <div className="flex-1 flex justify-start sm:justify-center overflow-x-auto scrollbar-hide">
              <div className="flex gap-0.5 sm:gap-1 items-center">
                {charlas.map((charla, index) => (
                  <button
                    key={index}
                    ref={(el) => { thumbnailRefs.current[index] = el; }}
                    onClick={() => goToSlide(index)}
                    disabled={isAnimating}
                    className={`shrink-0 rounded border transition-all duration-300 disabled:opacity-50 ${
                      index === currentIndex
                        ? 'w-24 sm:w-40 md:w-48 h-9 sm:h-14 md:h-16 border-gray-900 sm:border-2 bg-white shadow-sm'
                        : 'w-6 sm:w-10 md:w-12 h-8 sm:h-12 md:h-14 border-[#E6E6E6] sm:border-2 bg-[#F0F0F0] hover:bg-[#E6E6E6] hover:w-8 sm:hover:w-12 md:hover:w-16'
                    }`}
                  >
                    <div className="px-0.5 py-0.5 sm:p-1.5 md:p-2 h-full flex flex-col overflow-hidden justify-center">
                      <div className={`text-[8px] sm:text-xs font-mono transition-all leading-none ${
                        index === currentIndex ? 'text-gray-400 mb-0.5 sm:mb-1' : 'text-gray-500 text-center'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      {index === currentIndex && (
                        <h3 className="text-[8px] sm:text-xs font-medium text-left line-clamp-2 text-gray-900 leading-tight">
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
        className="fixed left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 hover:bg-[#F7F7F7] flex items-center justify-center transition-all border border-[#E6E6E6] shadow-lg hover:scale-110 disabled:opacity-50 backdrop-blur-sm"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        disabled={isAnimating}
        className="fixed right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 hover:bg-[#F7F7F7] flex items-center justify-center transition-all border border-[#E6E6E6] shadow-lg hover:scale-110 disabled:opacity-50 backdrop-blur-sm"
        aria-label="Siguiente"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Slide - Full Screen with fixed height */}
      <div 
        className="flex-1 flex items-center justify-center overflow-hidden py-2 sm:py-6 md:py-8 px-2 sm:px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`w-full max-w-7xl h-[calc(100vh-100px)] sm:h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 transition-all duration-300 ${
            direction === 'left' ? 'animate-slideOutLeft' : 
            direction === 'right' ? 'animate-slideOutRight' : 
            'animate-slideIn'
          }`}
        >
          {/* Left side - Talk content */}
          <div className="bg-white rounded-lg border border-[#E6E6E6] p-3 sm:p-6 md:p-8 lg:p-10 shadow-sm flex-1 lg:w-2/3 flex flex-col overflow-hidden">
            {/* Title - Fixed height */}
            <div className="shrink-0 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight line-clamp-2">
                {currentCharla.titulo}
              </h2>
              <div className="h-px bg-[#DCDCDC] mt-2 sm:mt-3 md:mt-4" />
            </div>

            {/* Content - Fixed Grid Layout with flex-1 */}
            <div className="flex-1 overflow-hidden">
              {/* Conditional Layout based on expansion state */}
              {isDescriptionExpanded ? (
                /* Expanded Description View - Full Width */
                <div className="h-full flex flex-col">
                  <button
                    onClick={() => setIsDescriptionExpanded(false)}
                    className="mb-3 sm:mb-4 flex items-center justify-between group hover:bg-[#F7F7F7] p-2 rounded-lg transition-all"
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Descripción
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                      <span className="text-xs hidden sm:inline">Cerrar</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </button>
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                      {currentCharla.descripcion}
                    </p>
                  </div>
                </div>
              ) : isQuestionsExpanded ? (
                /* Expanded Questions View - Full Width */
                <div className="h-full flex flex-col">
                  <button
                    onClick={() => setIsQuestionsExpanded(false)}
                    className="mb-3 sm:mb-4 flex items-center justify-between group hover:bg-[#F7F7F7] p-2 rounded-lg transition-all"
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Preguntas & Respuestas
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                      <span className="text-xs hidden sm:inline">Cerrar</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </button>
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {currentCharla.preguntas_respuestas && currentCharla.preguntas_respuestas.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        {currentCharla.preguntas_respuestas.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-4 sm:p-5 border border-[#E6E6E6] shadow-sm"
                          >
                            {/* Pregunta */}
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-gray-400 font-bold shrink-0 text-sm sm:text-base">Q{idx + 1}</span>
                              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                                {item.pregunta}
                              </p>
                            </div>
                            
                            {/* Respuesta - Always visible in expanded view */}
                            <div className="pl-7 sm:pl-8 border-l-2 border-green-200">
                              <div className="flex items-start gap-3">
                                <span className="text-green-600 font-bold shrink-0 text-sm sm:text-base">A:</span>
                                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                                  {item.respuesta}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm sm:text-base italic text-center">Sin preguntas registradas</p>
                    )}
                  </div>
                </div>
              ) : (
                /* Normal Grid Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-full">
                  {/* Left Column - Main content */}
                  <div className="flex flex-col gap-3 sm:gap-4 h-full overflow-hidden">
                    {/* Description - Takes 60% - Clickable */}
                    <button
                      onClick={() => setIsDescriptionExpanded(true)}
                      className="h-auto md:h-[60%] overflow-hidden text-left hover:bg-[#F7F7F7] p-3 sm:p-4 rounded-lg transition-all border border-transparent hover:border-[#E6E6E6] group"
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Descripción
                        </h3>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base line-clamp-6 md:line-clamp-8">
                          {currentCharla.descripcion}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-700 transition-colors">
                        Click para expandir
                      </p>
                    </button>

                    {/* Reflexión - Takes 40% */}
                    <div className="h-auto md:h-[40%] bg-[#F7F7F7] rounded-lg p-3 sm:p-4 md:p-5 border border-[#E6E6E6] flex flex-col overflow-hidden">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wide flex items-center justify-center gap-2 shrink-0">
                        Reflexión
                      </h3>
                      <div className="flex-1 overflow-y-auto scrollbar-thin">
                        {currentCharla.reflexion ? (
                          <p className="text-gray-700 text-xs sm:text-sm italic leading-relaxed">
                            {currentCharla.reflexion}
                          </p>
                        ) : (
                          <p className="text-gray-400 text-xs sm:text-sm italic text-center">Sin reflexión registrada</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Sidebar */}
                  <div className="flex flex-col gap-3 sm:gap-4 h-full overflow-hidden">
                    {/* Preguntas y Respuestas - Takes 70% - Clickable to expand */}
                    <button
                      onClick={() => setIsQuestionsExpanded(true)}
                      className="h-auto md:h-[70%] bg-[#F7F7F7] rounded-lg p-3 sm:p-4 md:p-5 border border-[#E6E6E6] hover:border-gray-400 flex flex-col overflow-hidden transition-all text-left group"
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3 shrink-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Preguntas & Respuestas
                        </h3>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {currentCharla.preguntas_respuestas && currentCharla.preguntas_respuestas.length > 0 ? (
                          <div className="space-y-2 sm:space-y-3">
                            {currentCharla.preguntas_respuestas.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="relative bg-white rounded-lg p-2.5 sm:p-3 border border-[#E6E6E6] transition-all"
                              >
                                {/* Pregunta - Always visible */}
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 font-bold shrink-0 text-xs">Q{idx + 1}</span>
                                  <p className="text-gray-900 text-[10px] sm:text-xs font-medium leading-relaxed line-clamp-2">
                                    {item.pregunta}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {currentCharla.preguntas_respuestas.length > 3 && (
                              <p className="text-xs text-gray-500 text-center mt-2">
                                +{currentCharla.preguntas_respuestas.length - 3} más...
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-xs sm:text-sm italic text-center">Sin preguntas registradas</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-700 transition-colors shrink-0">
                        Click para expandir
                      </p>
                    </button>

                    {/* Social Links - Takes 30% */}
                    <div className="h-auto md:h-[30%] bg-[#F7F7F7] rounded-lg p-3 sm:p-4 md:p-5 border border-[#E6E6E6] flex items-center justify-center">
                      {(currentCharla.linkedin || currentCharla.instagram || currentCharla.web) ? (
                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
                        {/* LinkedIn */}
                        {currentCharla.linkedin && typeof currentCharla.linkedin === 'string' && (
                          <a
                            href={currentCharla.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group hover:scale-110 transition-transform"
                            title="LinkedIn"
                          >
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#0A66C2] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
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
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-linear-to-br from-[#FED576] via-[#F47133] to-[#BC3081] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
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
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                              </div>
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-xs sm:text-sm italic">Sin enlaces</p>
                      )}
                    </div>
                    
                  </div>
                  
                </div>
              )}
            </div>
          </div>

          {/* Right side - Image card */}
          <div className="hidden lg:flex lg:w-1/3 bg-white rounded-lg border border-[#E6E6E6] shadow-sm overflow-hidden">
            <div className="w-full h-full flex items-center justify-center p-6 relative">
              {availableImages.length > 0 ? (
                <>
                  {/* Show only current image with fade animation */}
                  <div className="w-full h-full relative">
                    {availableImages.map((imgSrc, idx) => (
                      <img 
                        key={idx}
                        src={imgSrc}
                        alt={`${currentCharla.titulo} - Imagen ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                          idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ display: idx === currentImageIndex ? 'block' : 'none' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.parentElement?.querySelector('.fallback-message') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Image counter indicator - only show if multiple images */}
                  {availableImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                      {currentImageIndex + 1} / {availableImages.length}
                    </div>
                  )}
                  
                  {/* Navigation dots for images - only show if multiple images */}
                  {availableImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {availableImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex 
                              ? 'bg-gray-900 w-6' 
                              : 'bg-gray-400 hover:bg-gray-600'
                          }`}
                          aria-label={`Ver imagen ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : null}
              <div className="fallback-message hidden flex-col items-center justify-center text-gray-400">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Sin imagen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
