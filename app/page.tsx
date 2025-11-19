'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      router.push('/charlas');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden px-4">
      <div className="relative">
        {/* Main Title with Animation */}
        <h1 
          className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-gray-900 tracking-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Bitácora
        </h1>
        
        {/* Animated underline */}
        <div 
          className={`h-1 bg-gray-900 mt-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'w-full' : 'w-0'
          }`}
        />

        {/* Subtitle */}
        <p 
          className={`text-center text-gray-600 mt-6 text-lg transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Cargando experiencias...
        </p>
      </div>

      {/* Animated dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {/* Credits */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-700 px-4 w-full ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <p className="text-gray-500 text-xs sm:text-sm text-center">
          Hecho por Lucas Garbate, Milena Parysaw y Rocio Casares
        </p>
      </div>
    </div>
  );
}
