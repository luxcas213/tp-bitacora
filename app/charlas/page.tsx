import BitacoraCarousel from '../components/BitacoraCarousel';
import charlas from '../../data.json';

export default function CharlasPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] relative">
      {/* Main Content - Full Screen */}
      <main className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <BitacoraCarousel charlas={charlas} />
      </main>

      {/* Credits - Hidden in bottom right */}
      <div className="fixed bottom-2 right-2 z-10">
        <p className="text-gray-400 text-xs">
          Lucas Garbate, Milena Parysaw, Rocio Casares
        </p>
      </div>
    </div>
  );
}
