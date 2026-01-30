import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductLightbox = ({ isOpen, images, currentIndex, productName, onClose, onChangeIndex }) => {
  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onChangeIndex(newIndex);
  }, [currentIndex, images.length, onChangeIndex]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onChangeIndex(newIndex);
  }, [currentIndex, images.length, onChangeIndex]);

  // Navegación por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch/swipe para móvil
  useEffect(() => {
    if (!isOpen) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, handlePrev, handleNext]);

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(18, 18, 26, 0.95) 50%, rgba(26, 26, 46, 0.95) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor Principal */}
      <div
        className="relative flex flex-col md:flex-row w-full max-w-5xl h-[85vh] md:h-[80vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Área de Imagen Principal */}
        <div className="flex-1 relative h-full flex items-center justify-center">

          {/* Botón Cerrar - GAMER Style */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-12 h-12 glass-gamer rounded-full flex items-center justify-center text-white hover:text-neon-red hover:border-neon-red/50 transition-all duration-300 border border-gamer-border group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Flecha Izquierda */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 glass-gamer rounded-full flex items-center justify-center border border-gamer-border hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/20 group"
            >
              <ChevronLeft className="w-7 h-7 text-white group-hover:text-neon-cyan transition-colors" />
            </button>
          )}

          {/* Imagen Principal con Frame GAMER */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="relative max-w-full max-h-full">
              {/* Decorative corners */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-neon-cyan"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-neon-cyan"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-neon-cyan"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-neon-cyan"></div>

              <img
                src={images[currentIndex]?.url}
                alt={productName}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(0, 255, 247, 0.2))'
                }}
              />
            </div>
          </div>

          {/* Flecha Derecha */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 glass-gamer rounded-full flex items-center justify-center border border-gamer-border hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/20 group"
            >
              <ChevronRight className="w-7 h-7 text-white group-hover:text-neon-cyan transition-colors" />
            </button>
          )}

          {/* Info del Producto - GAMER Style Label */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40">
            <div className="glass-gamer px-6 py-3 rounded-full border border-neon-cyan/30 shadow-lg shadow-neon-cyan/10">
              <span className="font-gaming-alt text-white font-semibold text-lg whitespace-nowrap">{productName}</span>
            </div>
            {images.length > 1 && (
              <div className="glass-dark px-4 py-1.5 rounded-full border border-gamer-border">
                <span className="font-gaming text-neon-cyan text-sm">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails para Móvil (Abajo) */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-28 flex items-end justify-center pb-4 px-4 z-50 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => onChangeIndex(idx)}
                  className={`
                    w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2
                    ${idx === currentIndex
                      ? 'border-neon-cyan shadow-lg shadow-neon-cyan/30 opacity-100 scale-110'
                      : 'border-gamer-border opacity-50 hover:opacity-75'
                    }
                  `}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Thumbnails para Desktop (Lado derecho) */}
        {images.length > 1 && (
          <div className="hidden md:flex flex-col gap-2 p-4 w-24">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => onChangeIndex(idx)}
                className={`
                  w-full aspect-square rounded-lg overflow-hidden transition-all duration-300 border-2
                  ${idx === currentIndex
                    ? 'border-neon-cyan shadow-lg shadow-neon-cyan/30 opacity-100'
                    : 'border-gamer-border opacity-50 hover:opacity-75'
                  }
                `}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductLightbox;
