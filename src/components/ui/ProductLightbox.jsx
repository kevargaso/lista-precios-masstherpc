import React, { useEffect, useCallback } from 'react';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contenedor Principal - Simetría Geométrica */}
      <div
        className="relative flex flex-col md:flex-row w-full max-w-5xl h-[85vh] md:h-[80vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >



        {/* Área de Imagen Principal */}
        <div className="flex-1 relative h-full flex items-center justify-center">

          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-red-600 transition-all duration-200 shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Flecha Izquierda - Botón Flotante */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 group"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-gray-700 group-hover:text-blue-600 transition-colors"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Imagen Principal */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={images[currentIndex]?.url}
              alt={productName}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Flecha Derecha - Botón Flotante */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 group"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-gray-700 group-hover:text-blue-600 transition-colors"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Info del Producto - Label Flotante */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-40">
            <div className="px-5 py-2.5 bg-white/95 backdrop-blur rounded-full shadow-xl">
              <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">{productName}</span>
            </div>
            {images.length > 1 && (
              <div className="px-3 py-1 bg-black/60 backdrop-blur rounded-full">
                <span className="text-white text-xs font-medium">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Móvil: Miniaturas Horizontales (Abajo) */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center pb-4 px-4 z-50">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => onChangeIndex(idx)}
                  className={`
                    w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200
                    ${idx === currentIndex
                      ? 'ring-2 ring-blue-500 opacity-100'
                      : 'opacity-50'
                    }
                  `}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductLightbox;
