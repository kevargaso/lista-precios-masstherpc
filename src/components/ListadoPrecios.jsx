// Componente para mostrar el listado de precios por categorías
// Con animaciones hipnóticas estilo Temu/Shein
import React, { useState, useEffect } from 'react';

const ListadoPrecios = ({ formatCurrency, TRM }) => {
    // Estado para el temporizador falso estilo Temu
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
    const [flash, setFlash] = useState(false);
    // Estado para controlar qué productos tienen especificaciones expandidas
    const [expandedSpecs, setExpandedSpecs] = useState({});
    // Estado para el lightbox de imágenes
    const [lightboxImage, setLightboxImage] = useState(null);

    // Rutas locales de imágenes de productos (.webp en public/images/productos/)
    const productImages = {
        // Combos (imagen única por combo)
        'combo-ryzen-9600x': '/images/productos/combo-ryzen-9600x.webp',
        'combo-b850-tuf-ram': '/images/productos/combo-b850-tuf-ram.webp',
        'combo-b850-rog-ram': '/images/productos/combo-b850-rog-ram.webp',
        'combo-b550-tuf-32gb': '/images/productos/combo-b550-tuf-32gb.webp',
        'combo-b550-16gb': '/images/productos/combo-b550-16gb.webp',
        // Motherboards AMD
        'mb-b550m-a': '/images/productos/mb-b550m-a.webp',
        'mb-b550-f': '/images/productos/mb-b550-f.webp',
        'mb-b550-plus': '/images/productos/mb-b550-plus.webp',
        'mb-b850m-e': '/images/productos/mb-b850m-e.webp',
        'mb-b850-a': '/images/productos/mb-b850-a.webp',
        'mb-msi-b850': '/images/productos/mb-msi-b850.webp',
        'mb-b850-max': '/images/productos/mb-b850-max.webp',
        'mb-msi-b650': '/images/productos/mb-msi-b650.webp',
        // Motherboards Intel
        'mb-z890-aorus': '/images/productos/mb-z890-aorus.webp',
        'mb-z890-edge': '/images/productos/mb-z890-edge.webp',
        'mb-z890-asrock': '/images/productos/mb-z890-asrock.webp',
        'mb-z790-p': '/images/productos/mb-z790-p.webp',
        // RAM DDR4
        'ram-corsair-16': '/images/productos/ram-corsair-16.webp',
        'ram-gskill-32': '/images/productos/ram-gskill-32.webp',
        // RAM DDR5
        'ram-team-white': '/images/productos/ram-team-white.webp',
        'ram-team-black': '/images/productos/ram-team-black.webp',
        'ram-vcolor-32': '/images/productos/ram-vcolor-32.webp',
        // Procesadores AMD
        'ryzen-9600x': '/images/productos/ryzen-9600x.webp',
        'ryzen-7600x': '/images/productos/ryzen-7600x.webp',
        'ryzen-9800x3d': '/images/productos/ryzen-9800x3d.webp',
        // Procesadores Intel
        'intel-265k': '/images/productos/intel-265k.webp',
        'intel-265kf': '/images/productos/intel-265kf.webp',
        // Coolers
        'cooler-ml240l': '/images/productos/cooler-ml240l.webp',
        'cooler-hyper212': '/images/productos/cooler-hyper212.webp',
        'cooler-montech240': '/images/productos/cooler-montech240.webp',
        'cooler-montech120': '/images/productos/cooler-montech120.webp',
        'cooler-zalman': '/images/productos/cooler-zalman.webp',
        // GPUs
        'gpu-rx9070xt': '/images/productos/gpu-rx9070xt.webp',
        // Almacenamiento
        'ssd-wd-1tb': '/images/productos/ssd-wd-1tb.webp',
        'ssd-samsung-1tb': '/images/productos/ssd-samsung-1tb.webp',
        'ssd-samsung-2tb': '/images/productos/ssd-samsung-2tb.webp',
        // Fuentes de Poder
        'psu-msi-750': '/images/productos/psu-msi-750.webp',
        'psu-evga-700': '/images/productos/psu-evga-700.webp',
        'psu-corsair-850': '/images/productos/psu-corsair-850.webp',
    };

    // Cache de imágenes fallidas (persistente entre re-renders)
    const failedImagesRef = React.useRef(new Set());

    // Componente de miniatura con lightbox (muestra placeholder si no hay imagen)
    const ProductThumbnail = ({ productId, alt, className = '' }) => {
        const imageUrl = productImages[productId];
        const [, forceUpdate] = React.useReducer(x => x + 1, 0);

        // Si no hay URL o la imagen ya falló antes, mostrar placeholder
        if (!imageUrl || failedImagesRef.current.has(productId)) {
            return (
                <div className={`flex-shrink-0 ${className}`}>
                    <div className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center aspect-square">
                        <span className="text-gray-400 text-2xl">📷</span>
                    </div>
                </div>
            );
        }

        // Mostrar imagen con lightbox
        return (
            <div
                className={`cursor-pointer transition-transform hover:scale-105 flex-shrink-0 ${className}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage({ url: imageUrl, alt });
                }}
            >
                <img
                    src={imageUrl}
                    alt={alt}
                    className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all aspect-square"
                    onError={() => {
                        failedImagesRef.current.add(productId);
                        forceUpdate();
                    }}
                />
            </div>
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                    if (minutes < 0) {
                        minutes = 59;
                        hours--;
                        if (hours < 0) {
                            hours = 23;
                            minutes = 59;
                        }
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Flash effect cada 3 segundos
    useEffect(() => {
        const flashTimer = setInterval(() => {
            setFlash(true);
            setTimeout(() => setFlash(false), 500);
        }, 3000);
        return () => clearInterval(flashTimer);
    }, []);

    const toggleSpecs = (productId) => {
        setExpandedSpecs(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    return (
        <div className="bg-white mx-auto shadow-2xl min-h-[210mm] max-w-6xl p-6 md:p-10 print-content rounded-lg relative overflow-hidden">

            {/* CSS Animations */}
            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 100, 0, 0.5), 0 0 10px rgba(255, 100, 0, 0.3); }
          50% { box-shadow: 0 0 20px rgba(255, 100, 0, 0.8), 0 0 40px rgba(255, 100, 0, 0.5), 0 0 60px rgba(255, 100, 0, 0.3); }
        }
        @keyframes bounce-rotate {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          50% { transform: rotate(-5deg) scale(1.15); }
        }
        @keyframes price-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes rainbow-border {
          0% { border-color: #ff6b35; }
          25% { border-color: #ff0080; }
          50% { border-color: #ffd700; }
          75% { border-color: #00ff88; }
          100% { border-color: #ff6b35; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes fire-text {
          0%, 100% { 
            text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #ff6b35, 0 0 80px #ff6b35;
            filter: brightness(1);
          }
          50% { 
            text-shadow: 0 0 4px #fff, 0 0 10px #fff, 0 0 18px #fff, 0 0 38px #ff0080, 0 0 73px #ff0080;
            filter: brightness(1.2);
          }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flash-sale {
          0%, 100% { opacity: 1; background-color: #dc2626; }
          50% { opacity: 0.8; background-color: #fbbf24; }
        }
        @keyframes slide-tag {
          0%, 100% { transform: translateX(0) rotate(-3deg); }
          50% { transform: translateX(5px) rotate(-1deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.1); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          70% { transform: scale(1); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ff6b35 0%, #ffd700 25%, #ff0080 50%, #ffd700 75%, #ff6b35 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }
        .combo-card {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .bounce-badge {
          animation: bounce-rotate 0.8s ease-in-out infinite;
        }
        .price-animate {
          animation: price-pulse 0.8s ease-in-out infinite;
          display: inline-block;
        }
        .rainbow-border {
          animation: rainbow-border 2s linear infinite;
        }
        .float-effect {
          animation: float 2s ease-in-out infinite;
        }
        .fire-effect {
          animation: fire-text 1s ease-in-out infinite;
        }
        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          animation: confetti-fall 4s linear infinite;
        }
        .flash-bg {
          animation: flash-sale 0.5s ease-in-out infinite;
        }
        .heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .slide-in {
          animation: slide-tag 2s ease-in-out infinite;
        }
        .specs-expand {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>

            {/* Confetti Particles - Solo en sección de combos */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: '-10px',
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                            backgroundColor: ['#ff6b35', '#ffd700', '#ff0080', '#00ff88', '#00d4ff', '#9333ea'][Math.floor(Math.random() * 6)],
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                ))}
            </div>

            <div className="text-center mb-10 relative z-10">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#2b579a] to-[#1e3a8a] bg-clip-text text-transparent">
                    Listado de Precios al Público General
                </h1>
                <div className="flex justify-center items-center gap-8 text-sm text-gray-600 pb-4 border-b-2 border-gray-200">
                    <div><span className="font-bold text-black">TRM:</span> {formatCurrency(TRM, 'COP')}/USD</div>
                    <div>•</div>
                    <div><span className="font-bold text-black">Fecha:</span> {new Date().toLocaleDateString('es-CO')}</div>
                </div>

                {/* Nota sobre productos y garantía */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                    <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
                        <span className="text-2xl">📦</span>
                        <span>
                            <strong className="text-green-700">Todos los productos son nuevos y sellados en caja</strong>
                            <span className="text-gray-600"> (a menos que se aclare que es "open box", "blister", etc.)</span>
                        </span>
                        <span className="text-2xl">✅</span>
                    </p>
                    <p className="text-sm text-gray-700 mt-2 text-center">
                        <strong className="text-green-700">🛡️ Garantía de 6 meses</strong> por defectos de fábrica
                    </p>
                </div>
            </div>

            <div className="space-y-8 relative z-10">

                {/* ============================================== */}
                {/* SECCIÓN COMBOS - PRIMERO - SUPER HIPNÓTICA ESTILO TEMU */}
                {/* ============================================== */}
                <div className="category-section relative mt-4">

                    {/* Banner OFERTAS que rebota */}
                    <div className="absolute -top-4 -left-4 bounce-badge z-20">
                        <div className="bg-gradient-to-r from-red-600 via-pink-500 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-extrabold shadow-xl border-2 border-white">
                            🔥 ¡OFERTAS ESPECIALES! 🔥
                        </div>
                    </div>

                    {/* Badge de descuento flotante */}
                    <div className="absolute -top-2 right-4 float-effect z-20">
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-black text-lg shadow-xl transform rotate-12 border-2 border-white">
                            -15%
                        </div>
                    </div>

                    {/* Temporizador URGENTE */}
                    <div className="mb-6 mt-10">
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-xl ${flash ? 'flash-bg' : 'bg-red-600'} text-white transition-all`}>
                            <span className="text-2xl heartbeat">⏰</span>
                            <span className="font-bold text-lg">¡OFERTA TERMINA EN:</span>
                            <div className="flex gap-1 font-mono text-2xl font-black">
                                <span className="bg-black/30 px-3 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="price-animate">:</span>
                                <span className="bg-black/30 px-3 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                <span className="price-animate">:</span>
                                <span className="bg-black/30 px-3 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            </div>
                            <span className="text-2xl heartbeat">🔥</span>
                        </div>
                    </div>

                    {/* Título COMBOS con efecto shimmer */}
                    <div className="mb-6">
                        <h2 className="text-4xl font-black shimmer-text flex items-center gap-3">
                            🎁 COMBOS ESPECIALES 🎁
                        </h2>
                        <div className="h-2 w-48 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full mt-3 gradient-animate"></div>
                    </div>

                    {/* Contenedor principal con borde animado */}
                    <div className="combo-card border-4 rainbow-border rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">

                        {/* Barra superior con efecto */}
                        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-2 px-4 flex items-center justify-center gap-2 gradient-animate">
                            <span className="float-effect">⭐</span>
                            <span className="font-bold">¡ÚLTIMAS UNIDADES DISPONIBLES!</span>
                            <span className="float-effect">⭐</span>
                        </div>

                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
                                    <th className="px-6 py-5 text-left text-xl font-bold">🔥 Combo</th>
                                    <th className="px-6 py-5 text-right text-xl font-bold w-56">Precio Combo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b-2 border-orange-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 transition-all duration-300">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ProductThumbnail productId="combo-ryzen-9600x" alt="Combo Ryzen 5 9600X" className="mr-2" />
                                                <span className="text-orange-500 text-xl heartbeat">🎯</span>
                                                <span className="text-gray-900 font-bold text-lg">CPU RYZEN 5 9600X + KIT RGB DDR5 16GB (8X2) 6000 MHZ + BOARD B850 + R. LIQUIDA 240 RGB</span>
                                                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold ml-2">HOT</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('combo-ryzen-9600x')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                            >
                                                {expandedSpecs['combo-ryzen-9600x'] ? '▲' : '▼'} Más detalles
                                            </button>
                                        </div>
                                        {expandedSpecs['combo-ryzen-9600x'] && (
                                            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-3 text-lg">📦 Productos incluidos en el combo:</h4>
                                                <div className="space-y-3">
                                                    {/* Producto 1: Ryzen 5 9600X */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">AMD Ryzen 5 9600X</p>
                                                                <a
                                                                    href="#procesadores"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        // Primero hacer scroll
                                                                        document.getElementById('procesadores')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        // Luego expandir especificaciones después del scroll
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'ryzen-9600x': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$840.000</div>
                                                                <div className="text-lg font-bold text-green-600">$800.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $40.000</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Producto 2: MSI B850 */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">MSI B850 GAMING PLUS WIFI</p>
                                                                <a
                                                                    href="#motherboards"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        // Primero hacer scroll
                                                                        document.getElementById('motherboards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        // Luego expandir especificaciones después del scroll
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'mb-msi-b850': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$750.000</div>
                                                                <div className="text-lg font-bold text-green-600">$700.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $50.000</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Producto 3: RAM DDR5 */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">Team Group 16GB (2 x 8GB) DDR5 6000 MHz Blanca</p>
                                                                <a
                                                                    href="#memoria-ram"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        // Primero hacer scroll
                                                                        document.getElementById('memoria-ram')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        // Luego expandir especificaciones después del scroll
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'ram-team-white': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$750.000</div>
                                                                <div className="text-lg font-bold text-green-600">$650.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $100.000</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Producto 4: Cooler */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">Cooler Master MasterLiquid 240L Core ARGB</p>
                                                                <a
                                                                    href="#refrigeracion"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        // Primero hacer scroll
                                                                        document.getElementById('refrigeracion')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        // Luego expandir especificaciones después del scroll
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'cooler-ml240l': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$230.000</div>
                                                                <div className="text-lg font-bold text-green-600">$200.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $30.000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-gray-700">Total ahorro en combo:</span>
                                                        <span className="text-2xl font-black text-green-600">$220.000 💰</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right align-top">
                                        <div className="price-animate text-3xl font-black text-red-600 fire-effect">$2.350.000</div>
                                        <div className="text-sm text-gray-500 line-through">$2.570.000</div>
                                        <div className="text-xs text-green-600 font-bold">¡Ahorras $220.000! 💰</div>
                                    </td>
                                </tr>

                                {/* Combo 2: BOARD B850 TUF GAMING + KIT RAM 16GB DDR5 RGB */}
                                <tr className="border-b-2 border-orange-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 transition-all duration-300 bg-white">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500 text-xl heartbeat">🎯</span>
                                                <span className="text-gray-900 font-bold text-lg">BOARD B850 TUF GAMING + KIT RAM 16GB DDR5 RGB</span>
                                                <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-bold ml-2">POPULAR</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('combo-b850-tuf-ram')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                            >
                                                {expandedSpecs['combo-b850-tuf-ram'] ? '▲' : '▼'} Más detalles
                                            </button>
                                        </div>
                                        {expandedSpecs['combo-b850-tuf-ram'] && (
                                            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-3 text-lg">📦 Productos incluidos en el combo:</h4>
                                                <div className="space-y-3">
                                                    {/* Producto 1: ASUS TUF GAMING B850M-E WIFI */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">ASUS TUF GAMING B850M-E WIFI</p>
                                                                <a
                                                                    href="#motherboards"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('motherboards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'mb-b850m-e': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$680.000</div>
                                                                <div className="text-lg font-bold text-green-600">$640.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $40.000</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Producto 2: Team Group 16GB DDR5 Negra */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">Team Group 16GB (2 x 8GB) DDR5 6000 MHz Negra</p>
                                                                <a
                                                                    href="#memoria-ram"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('memoria-ram')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'ram-team-black': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$750.000</div>
                                                                <div className="text-lg font-bold text-green-600">$650.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $100.000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-gray-700">Total ahorro en combo:</span>
                                                        <span className="text-2xl font-black text-green-600">$140.000 💰</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right align-top">
                                        <div className="price-animate text-3xl font-black text-red-600 fire-effect">$1.290.000</div>
                                        <div className="text-sm text-gray-500 line-through">$1.430.000</div>
                                        <div className="text-xs text-green-600 font-bold">¡Ahorras $140.000! 💰</div>
                                    </td>
                                </tr>

                                {/* Combo 3: BOARD B850 ROG STRIX + KIT RAM 16GB DDR5 RGB */}
                                <tr className="border-b-2 border-orange-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 transition-all duration-300">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500 text-xl heartbeat">🎯</span>
                                                <span className="text-gray-900 font-bold text-lg">BOARD B850 ROG STRIX + KIT RAM 16GB DDR5 RGB</span>
                                                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold ml-2">PREMIUM</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('combo-b850-rog-ram')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                            >
                                                {expandedSpecs['combo-b850-rog-ram'] ? '▲' : '▼'} Más detalles
                                            </button>
                                        </div>
                                        {expandedSpecs['combo-b850-rog-ram'] && (
                                            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-3 text-lg">📦 Productos incluidos en el combo:</h4>
                                                <div className="space-y-3">
                                                    {/* Producto 1: ASUS ROG STRIX B850-A */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">ASUS ROG STRIX B850-A GAMING WIFI R2</p>
                                                                <a
                                                                    href="#motherboards"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('motherboards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'mb-b850-a': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$750.000</div>
                                                                <div className="text-lg font-bold text-green-600">$685.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $65.000</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Producto 2: Team Group 16GB DDR5 Negra */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">Team Group 16GB (2 x 8GB) DDR5 6000 MHz Negra</p>
                                                                <a
                                                                    href="#memoria-ram"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('memoria-ram')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'ram-team-black': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$750.000</div>
                                                                <div className="text-lg font-bold text-green-600">$685.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $65.000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-gray-700">Total ahorro en combo:</span>
                                                        <span className="text-2xl font-black text-green-600">$130.000 💰</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right align-top">
                                        <div className="price-animate text-3xl font-black text-red-600 fire-effect">$1.370.000</div>
                                        <div className="text-sm text-gray-500 line-through">$1.500.000</div>
                                        <div className="text-xs text-green-600 font-bold">¡Ahorras $130.000! 💰</div>
                                    </td>
                                </tr>

                                {/* Combo 4: BOARD B550 TUF GAMING + KIT RAM 32GB DDR4 */}
                                <tr className="border-b-2 border-orange-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 transition-all duration-300 bg-white">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500 text-xl heartbeat">🎯</span>
                                                <span className="text-gray-900 font-bold text-lg">BOARD B550 TUF GAMING + KIT RAM 32GB DDR4 3200MHZ</span>
                                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-bold ml-2">RENDIMIENTO</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('combo-b550-tuf-32gb')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                            >
                                                {expandedSpecs['combo-b550-tuf-32gb'] ? '▲' : '▼'} Más detalles
                                            </button>
                                        </div>
                                        {expandedSpecs['combo-b550-tuf-32gb'] && (
                                            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-3 text-lg">📦 Productos incluidos en el combo:</h4>
                                                <div className="space-y-3">
                                                    {/* Producto 1: ASUS TUF GAMING B550-PLUS WIFI II */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">ASUS TUF GAMING B550-PLUS WIFI II</p>
                                                                <a
                                                                    href="#motherboards"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('motherboards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'mb-b550-plus': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$499.000</div>
                                                                <div className="text-lg font-bold text-green-600">$450.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $49.000</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Producto 2: G.SKILL Ripjaws V 32GB DDR4 */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">G.SKILL Ripjaws V Series 32GB (2 x 16GB) DDR4</p>
                                                                <a
                                                                    href="#memoria-ram"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('memoria-ram')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'ram-gskill-32': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$750.000</div>
                                                                <div className="text-lg font-bold text-green-600">$700.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $50.000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-gray-700">Total ahorro en combo:</span>
                                                        <span className="text-2xl font-black text-green-600">$99.000 💰</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right align-top">
                                        <div className="price-animate text-3xl font-black text-red-600 fire-effect">$1.150.000</div>
                                        <div className="text-sm text-gray-500 line-through">$1.249.000</div>
                                        <div className="text-xs text-green-600 font-bold">¡Ahorras $99.000! 💰</div>
                                    </td>
                                </tr>

                                {/* Combo 5: BOARD B550 + KIT RAM 16GB DDR4 */}
                                <tr className="hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 transition-all duration-300 bg-white">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ProductThumbnail productId="combo-b550-16gb" alt="Combo B550 + RAM 16GB DDR4" className="mr-2" />
                                                <span className="text-orange-500 text-xl heartbeat">🎯</span>
                                                <span className="text-gray-900 font-bold text-lg">BOARD B550 + KIT RAM 16GB DDR4 3200MHZ</span>
                                                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-bold ml-2">ECONÓMICO</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('combo-b550-16gb')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                            >
                                                {expandedSpecs['combo-b550-16gb'] ? '▲' : '▼'} Más detalles
                                            </button>
                                        </div>
                                        {expandedSpecs['combo-b550-16gb'] && (
                                            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-3 text-lg">📦 Productos incluidos en el combo:</h4>
                                                <div className="space-y-3">
                                                    {/* Producto 1: ASUS PRIME B550M-A WiFi II */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">ASUS PRIME B550M-A WiFi II</p>
                                                                <a
                                                                    href="#motherboards"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('motherboards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'mb-b550m-a': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$360.000</div>
                                                                <div className="text-lg font-bold text-green-600">$330.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $30.000</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Producto 2: CORSAIR Vengeance LPX 16GB DDR4 */}
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">CORSAIR Vengeance LPX 16GB (2 x 8GB) DDR4</p>
                                                                <a
                                                                    href="#memoria-ram"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById('memoria-ram')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        setTimeout(() => {
                                                                            setExpandedSpecs(prev => ({ ...prev, 'ram-corsair-16': true }));
                                                                        }, 800);
                                                                    }}
                                                                >
                                                                    Ver especificaciones →
                                                                </a>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 line-through">$450.000</div>
                                                                <div className="text-lg font-bold text-green-600">$420.000</div>
                                                                <div className="text-xs text-green-600">Ahorras $30.000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-gray-700">Total ahorro en combo:</span>
                                                        <span className="text-2xl font-black text-green-600">$60.000 💰</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right align-top">
                                        <div className="price-animate text-3xl font-black text-red-600 fire-effect">$750.000</div>
                                        <div className="text-sm text-gray-500 line-through">$810.000</div>
                                        <div className="text-xs text-green-600 font-bold">¡Ahorras $60.000! 💰</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Banner inferior MEGA llamativo */}
                        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white px-6 py-4 text-center gradient-animate">
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <span className="text-3xl float-effect">💰</span>
                                <span className="font-black text-xl md:text-2xl tracking-wide">
                                    ¡AHORRA HASTA <span className="text-yellow-300 shimmer-text">$220.000</span> COMPRANDO EN COMBO!
                                </span>
                                <span className="text-3xl float-effect">🎉</span>
                            </div>
                            <div className="mt-2 text-sm opacity-90">
                                🚀 CONTRAENTREGA BOGOTÁ • ⚡ Entrega en 24-48 horas
                            </div>
                        </div>
                    </div>

                    {/* Badges flotantes decorativos */}
                    <div className="absolute -right-2 top-1/2 float-effect z-10">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-l-full font-bold text-sm shadow-lg">
                            ✓ CONTRAENTREGA BOGOTÁ
                        </div>
                    </div>
                </div>

                {/* ============================================== */}
                {/* Categoría: Portátiles - CON ESPECIFICACIONES DESPLEGABLES */}
                {/* ============================================== */}
                <div className="category-section mt-12">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            💻 Portátiles
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">Acer Nitro V 16 AI 16" WUXGA IPS 180Hz Gaming Laptop</span>
                                            <button
                                                onClick={() => toggleSpecs('acer-nitro')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['acer-nitro'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['acer-nitro'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones Técnicas:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Procesador:</strong> AMD Ryzen AI 5 240 Processor</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tarjeta Gráfica:</strong> NVIDIA GeForce RTX 5050 with 8GB GDDR7 VRAM</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria RAM:</strong> 16GB DDR5</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Almacenamiento:</strong> 512GB PCIe Gen 4 SSD</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Pantalla:</strong> 1920 x 1200 display, featuring true-to-life, accurate colors. Boasting a 180Hz refresh rate</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$3.199.900</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categoría: Procesadores (AMD e Intel unificados) */}
                <div id="procesadores" className="category-section">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            ⚡ Procesadores
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-center text-lg font-semibold w-32">Stock</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Separador AMD */}
                                <tr className="bg-gradient-to-r from-red-500 to-orange-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        AMD RYZEN
                                    </td>
                                </tr>

                                {/* Ryzen 5 9600X */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="ryzen-9600x" alt="AMD Ryzen 5 9600X" />
                                                <span className="text-gray-800 font-medium">AMD Ryzen 5 9600X</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('ryzen-9600x')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ryzen-9600x'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ryzen-9600x'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones Técnicas:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Núcleos/Hilos:</strong> 6 núcleos / 12 hilos</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Base:</strong> 3.9 GHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Turbo:</strong> hasta 5.4 GHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>TDP:</strong> 65W</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Arquitectura:</strong> Zen 5</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">5</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$840.000</td>
                                </tr>

                                {/* Ryzen 5 7600X blister */}
                                <tr className="border-b-2 border-gray-300 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="ryzen-7600x" alt="AMD Ryzen 5 7600X" />
                                                <span className="text-gray-800 font-medium">AMD Ryzen 5 7600X</span>
                                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">BLISTER</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('ryzen-7600x')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ryzen-7600x'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ryzen-7600x'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones Técnicas:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Núcleos/Hilos:</strong> 6 núcleos / 12 hilos</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Base:</strong> 4.7 GHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Turbo:</strong> hasta 5.3 GHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>TDP:</strong> 105W</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Arquitectura:</strong> Zen 4</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">3</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$700.000</td>
                                </tr>

                                {/* Separador Intel */}
                                <tr className="bg-gradient-to-r from-blue-600 to-cyan-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        INTEL CORE
                                    </td>
                                </tr>

                                {/* Core Ultra 7 265K */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="intel-265k" alt="Intel Core Ultra 7 265K" />
                                                <span className="text-gray-800 font-medium">Intel Core Ultra 7 265K</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('intel-265k')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['intel-265k'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['intel-265k'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones Técnicas:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Núcleos/Hilos:</strong> 20 núcleos (8 P-cores + 12 E-cores) / 20 hilos</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Base:</strong> 3.9 GHz (P-cores) / 3.3 GHz (E-cores)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Turbo:</strong> hasta 5.5 GHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>TDP:</strong> 125W (250W MTP)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Arquitectura:</strong> Arrow Lake (Socket 1851)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">4</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$1.200.000</td>
                                </tr>

                                {/* Core Ultra 7 265KF */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="intel-265kf" alt="Intel Core Ultra 7 265KF" />
                                                <span className="text-gray-800 font-medium">Intel Core Ultra 7 265KF</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('intel-265kf')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['intel-265kf'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['intel-265kf'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones Técnicas:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Núcleos/Hilos:</strong> 20 núcleos (8 P-cores + 12 E-cores) / 20 hilos</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Base:</strong> 3.9 GHz (P-cores) / 3.3 GHz (E-cores)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Frecuencia Turbo:</strong> hasta 5.5 GHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>TDP:</strong> 125W (250W MTP)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Nota:</strong> Sin gráficos integrados (versión F)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">4</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$1.160.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categoría: Motherboard */}
                <div id="motherboards" className="category-section">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            🔧 Motherboards
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-center text-lg font-semibold w-32">Stock</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Separador AMD */}
                                <tr className="bg-gradient-to-r from-red-500 to-orange-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        AMD - Socket AM4
                                    </td>
                                </tr>

                                {/* ASUS PRIME B550M-A WiFi II */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-b550m-a" alt="ASUS PRIME B550M-A WiFi II" />
                                                <span className="text-gray-800 font-medium">ASUS PRIME B550M-A WiFi II</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-b550m-a')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-b550m-a'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-b550m-a'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> Micro-ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR4, 4 slots, hasta 128GB</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B550</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">8</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$360.000</td>
                                </tr>

                                {/* ASUS ROG STRIX B550-F GAMING WIFI II */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-b550-f" alt="ASUS ROG STRIX B550-F GAMING WIFI II" />
                                                <span className="text-gray-800 font-medium">ASUS ROG STRIX B550-F GAMING WIFI II</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-b550-f')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-b550-f'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-b550-f'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR4, 4 slots, hasta 128GB</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B550</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">6</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$499.000</td>
                                </tr>

                                {/* ASUS TUF GAMING B550-PLUS WIFI II */}
                                <tr className="border-b-2 border-gray-300 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-b550-plus" alt="ASUS TUF GAMING B550-PLUS WIFI II" />
                                                <span className="text-gray-800 font-medium">ASUS TUF GAMING B550-PLUS WIFI II</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-b550-plus')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-b550-plus'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-b550-plus'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR4, 4 slots, hasta 128GB</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B550</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">5</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$499.000</td>
                                </tr>

                                {/* Separador AMD AM5 */}
                                <tr className="bg-gradient-to-r from-red-500 to-orange-500">
                                    <td colSpan="3" className="px-6 py-4 text-white font-bold text-center text-sm">
                                        AMD - Socket AM5
                                    </td>
                                </tr>

                                {/* ASUS ROG STRIX B850-A GAMING WIFI R2 BLANCA */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-b850-a" alt="ASUS ROG STRIX B850-A GAMING WIFI R2" />
                                                <span className="text-gray-800 font-medium">ASUS ROG STRIX B850-A GAMING WIFI R2</span>
                                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">BLANCA</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-b850-a')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-b850-a'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-b850-a'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots, hasta 192GB</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B850</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">2</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$750.000</td>
                                </tr>

                                {/* ASUS TUF GAMING B850M-E WIFI */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-b850m-e" alt="ASUS TUF GAMING B850M-E WIFI" />
                                                <span className="text-gray-800 font-medium">ASUS TUF GAMING B850M-E WIFI</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-b850m-e')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-b850m-e'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-b850m-e'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> Micro-ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B850</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">7</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$650.000</td>
                                </tr>

                                {/* ASUS B850 MAX GAMING WIFI W BLANCA */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-b850-max" alt="ASUS B850 MAX GAMING WIFI W" />
                                                <span className="text-gray-800 font-medium">ASUS B850 MAX GAMING WIFI W</span>
                                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">BLANCA</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-b850-max')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-b850-max'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-b850-max'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B850</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">4</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$600.000</td>
                                </tr>

                                {/* MSI B850 GAMING PLUS WIFI */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-msi-b850" alt="MSI B850 GAMING PLUS WIFI" />
                                                <span className="text-gray-800 font-medium">MSI B850 GAMING PLUS WIFI</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-msi-b850')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-msi-b850'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-msi-b850'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B850</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">3</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$750.000</td>
                                </tr>

                                {/* MSI PRO B650-S WIFI */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="mb-msi-b650" alt="MSI PRO B650-S WIFI" />
                                                <span className="text-gray-800 font-medium">MSI PRO B650-S WIFI</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-msi-b650')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-msi-b650'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-msi-b650'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B650</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">5</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$550.000</td>
                                </tr>

                                {/* ASROCK PHANTOM GAMING B850I LIGHTNING WIFI */}
                                <tr className="border-b-2 border-gray-300 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">ASROCK PHANTOM GAMING B850I LIGHTNING WIFI</span>
                                            <button
                                                onClick={() => toggleSpecs('mb-asrock-b850i')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-asrock-b850i'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-asrock-b850i'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> Mini-ITX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 2 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> AMD B850</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">2</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$580.000</td>
                                </tr>

                                {/* Separador Intel LGA1851 */}
                                <tr className="bg-gradient-to-r from-blue-600 to-cyan-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        INTEL - Socket LGA 1851
                                    </td>
                                </tr>

                                {/* Gigabyte Z890 Aorus Elite WiFi7 */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">Gigabyte Z890 Aorus Elite WiFi7</span>
                                            <button
                                                onClick={() => toggleSpecs('mb-z890-aorus')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-z890-aorus'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-z890-aorus'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> Intel Z890</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">3</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$900.000</td>
                                </tr>

                                {/* MSI MPG Z890 Edge TI WiFi BLANCA */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-800 font-medium">MSI MPG Z890 Edge TI WiFi</span>
                                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">BLANCA</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mb-z890-edge')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-z890-edge'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-z890-edge'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> Intel Z890</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">2</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$900.000</td>
                                </tr>

                                {/* AsRock Z890 PRO RS WiFi */}
                                <tr className="border-b-2 border-gray-300 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">AsRock Z890 PRO RS WiFi</span>
                                            <button
                                                onClick={() => toggleSpecs('mb-z890-pro')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-z890-pro'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-z890-pro'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> Intel Z890</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">4</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$750.000</td>
                                </tr>

                                {/* Separador Intel LGA1700 */}
                                <tr className="bg-gradient-to-r from-blue-600 to-cyan-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        INTEL - Socket LGA 1700
                                    </td>
                                </tr>

                                {/* MSI PRO Z790-P WIFI */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">MSI PRO Z790-P WIFI</span>
                                            <button
                                                onClick={() => toggleSpecs('mb-z790-p')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mb-z790-p'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mb-z790-p'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Formato:</strong> ATX</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Memoria:</strong> DDR5, 4 slots, hasta 128GB</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chipset:</strong> Intel Z790</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">6</span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$550.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categoría: Memoria RAM */}
                <div id="memoria-ram" className="category-section">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            Memoria RAM <span className="animate-pulse">👀</span>
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-center text-lg font-semibold w-32">Stock</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Separador DDR4 */}
                                <tr className="bg-gradient-to-r from-purple-600 to-pink-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        DDR4
                                    </td>
                                </tr>

                                {/* CORSAIR Vengeance LPX 16GB DDR4 */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="ram-corsair-16" alt="CORSAIR Vengeance LPX 16GB DDR4" />
                                                <span className="text-gray-800 font-medium">CORSAIR Vengeance LPX 16GB (2 x 8GB) DDR4</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('ram-corsair-16')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ram-corsair-16'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ram-corsair-16'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Latencia:</strong> CL16</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Velocidad:</strong> 3200 MHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tipo:</strong> 288-Pin PC RAM (PC4 25600)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Modelo:</strong> CMK16GX4M2E3200C16</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                            10
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$450.000</td>
                                </tr>

                                {/* G.SKILL Ripjaws V Series 32GB DDR4 */}
                                <tr className="border-b-2 border-gray-300 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="ram-gskill-32" alt="G.SKILL Ripjaws V Series 32GB DDR4" />
                                                <span className="text-gray-800 font-medium">G.SKILL Ripjaws V Series 32GB (2 x 16GB) DDR4</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('ram-gskill-32')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ram-gskill-32'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ram-gskill-32'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Latencia:</strong> CL16</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Velocidad:</strong> 3200 MHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tipo:</strong> 288-Pin PC RAM (PC4 25600)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Modelo:</strong> F4-3200C16D-32GVK</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">
                                            2
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$750.000</td>
                                </tr>

                                {/* Separador DDR5 */}
                                <tr className="bg-gradient-to-r from-purple-600 to-pink-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        DDR5
                                    </td>
                                </tr>

                                {/* Team Group 16GB DDR5 Negra */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="ram-team-black" alt="Team Group DDR5 6000 MHz Negra" />
                                                <span className="text-gray-800 font-medium">Team Group 16GB (2 x 8GB) DDR5 6000 MHz</span>
                                                <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEGRA</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('ram-team-black')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ram-team-black'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ram-team-black'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Latencia:</strong> CL38</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Velocidad:</strong> 6000 MHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tipo:</strong> 288-Pin PC (PC5 48000)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Modelo:</strong> FF3D516G6000HC38ADC01</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                            6
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$750.000</td>
                                </tr>

                                {/* Team Group 16GB DDR5 Blanca */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="ram-team-white" alt="Team Group DDR5 6000 MHz Blanca" />
                                                <span className="text-gray-800 font-medium">Team Group 16GB (2 x 8GB) DDR5 6000 MHz</span>
                                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">BLANCA</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('ram-team-white')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ram-team-white'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ram-team-white'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Latencia:</strong> CL38</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Velocidad:</strong> 6000 MHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tipo:</strong> 288-Pin PC (PC5 48000)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Modelo:</strong> FF4D516G6000HC38ADC01</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                            14
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$750.000</td>
                                </tr>

                                {/* V-COLOR Manta XSky 32GB DDR5 */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-800 font-medium">V-COLOR Manta XSky 32GB (2 x 16GB) DDR5 6000 MHz</span>
                                                <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEGRA</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('ram-vcolor-32')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ram-vcolor-32'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ram-vcolor-32'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Latencia:</strong> CL30</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Velocidad:</strong> 6000 MHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Chip:</strong> SK Hynix IC</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>RGB:</strong> Sí</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>AMD EXPO:</strong> Compatible</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Modelo:</strong> TMXSAL1660830KWK</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                            4
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$1.420.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categoría: Almacenamiento */}
                <div className="category-section">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            💾 Almacenamiento
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-center text-lg font-semibold w-32">Stock</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Separador SSD */}
                                <tr className="bg-gradient-to-r from-purple-600 to-pink-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        SSD (Unidades de Estado Sólido)
                                    </td>
                                </tr>

                                {/* TeamGroup CX1 240GB */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">TeamGroup CX1 240GB SSD SATA III 2.5"</span>
                                            <button
                                                onClick={() => toggleSpecs('ssd-teamgroup-cx1')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['ssd-teamgroup-cx1'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['ssd-teamgroup-cx1'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Capacidad:</strong> 240GB</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Interface:</strong> SATA III 6Gb/s</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Factor de forma:</strong> 2.5 pulgadas</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Lectura secuencial:</strong> hasta 520 MB/s</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Escritura secuencial:</strong> hasta 430 MB/s</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>TBW:</strong> 80 TBW</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>MTBF:</strong> 1,000,000 horas</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tecnologías:</strong> SLC Caching, ECC, Wear-Leveling</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Resistencia:</strong> 1500G/0.5ms shock resistant</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-sm">
                                            1
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$150.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categoría: Tarjetas Gráficas */}
                <div className="category-section">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            🎮 Tarjetas Gráficas
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-center text-lg font-semibold w-32">Stock</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Separador AMD */}
                                <tr className="bg-gradient-to-r from-red-500 to-orange-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        AMD RADEON
                                    </td>
                                </tr>

                                {/* AMD RX 9070 XT */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="gpu-rx9070xt" alt="AMD Radeon RX 9070 XT 16GB" />
                                                <span className="text-gray-800 font-medium">AMD Radeon RX 9070 XT 16GB - ASRock Challenger</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('gpu-rx9070xt')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['gpu-rx9070xt'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['gpu-rx9070xt'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones Técnicas:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>VRAM:</strong> 16GB GDDR6</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Bus de Memoria:</strong> 256-bit</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Stream Processors:</strong> 4096</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Boost Clock:</strong> hasta 2970 MHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Game Clock:</strong> 2400 MHz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>TBP:</strong> 304W</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>PSU Recomendada:</strong> 800W</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Conectores:</strong> 2x 8-pin</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Enfriamiento:</strong> Triple Fan</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Interface:</strong> PCIe 5.0 x16</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-sm">
                                            1
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$2.900.000</td>
                                </tr>

                                {/* Separador NVIDIA */}
                                <tr className="bg-gradient-to-r from-green-600 to-emerald-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        NVIDIA GEFORCE
                                    </td>
                                </tr>

                                {/* NVIDIA Sin Stock */}
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <td colSpan="3" className="px-6 py-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-4xl">📦</span>
                                            <p className="text-gray-600 font-semibold">Sin stock disponible por el momento</p>
                                            <p className="text-sm text-gray-500">Próximamente nuevos modelos NVIDIA GeForce</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categoría: Refrigeración */}
                <div id="refrigeracion" className="category-section">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            ❄️ Refrigeración
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-center text-lg font-semibold w-32">Stock</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Separador Aire */}
                                <tr className="bg-gradient-to-r from-cyan-500 to-blue-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        REFRIGERACIÓN POR AIRE
                                    </td>
                                </tr>

                                {/* Cooler Master Hyper 212 Spectrum V3 */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="cooler-hyper212" alt="Cooler Master Hyper 212 Spectrum V3" />
                                                <span className="text-gray-800 font-medium">Cooler Master Hyper 212 Spectrum V3 ARGB</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('cooler-hyper212')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['cooler-hyper212'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['cooler-hyper212'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>TDP:</strong> 200W</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Altura:</strong> 152mm</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Ventilador:</strong> 120mm PWM</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Velocidad:</strong> 650-1750 RPM</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Ruido:</strong> 27.2 dBA</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Heat Pipes:</strong> 4 de contacto directo</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Compatibilidad:</strong> AMD AM5/AM4, Intel LGA 1851/1700/1200</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Modelo:</strong> RR-S4NA-17PA-R1</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                            4
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$60.000</td>
                                </tr>

                                {/* Separador Líquida */}
                                <tr className="bg-gradient-to-r from-cyan-500 to-blue-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        REFRIGERACIÓN LÍQUIDA (AIO)
                                    </td>
                                </tr>

                                {/* MONTECH HyperFlow ARGB 240 */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="cooler-montech240" alt="MONTECH HyperFlow ARGB 240mm" />
                                                <span className="text-gray-800 font-medium">MONTECH HyperFlow ARGB 240mm AIO</span>
                                                <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEGRO</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('cooler-montech240')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['cooler-montech240'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['cooler-montech240'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Radiador:</strong> 240mm (277 × 120 × 27mm)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Bomba:</strong> hasta 3100 RPM, 28 dBA</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Ventiladores:</strong> 2x METAL PRO 12 ARGB 120mm PWM</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Velocidad ventiladores:</strong> 600-2100 RPM, 29.1 dBA</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>ARGB:</strong> Bomba y ventiladores (5V 3-pin)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tubos:</strong> 400mm</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Compatibilidad:</strong> Intel LGA 115X/1200/1700/1851/20XX, AMD AM3/AM4/AM5</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                            4
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$230.000</td>
                                </tr>

                                {/* Cooler Master MasterLiquid 240L Core */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProductThumbnail productId="cooler-ml240l" alt="Cooler Master MasterLiquid 240L" />
                                                <span className="text-gray-800 font-medium">Cooler Master MasterLiquid 240L Core ARGB</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('cooler-ml240l')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['cooler-ml240l'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['cooler-ml240l'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Radiador:</strong> 240mm AIO</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Bomba:</strong> Gen S Coldplate</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Ventiladores:</strong> 2x 120mm PWM</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>ARGB Sync:</strong> Sí</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Pasta térmica:</strong> CryoFuze incluida</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Compatibilidad:</strong> AMD AM5/AM4, Intel LGA 1851/1700/1200</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Modelo:</strong> MLW-D24M-A18PZ-R1</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">
                                            2
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$230.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categoría: Periféricos */}
                <div className="category-section">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                            🖱️ Periféricos
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-center text-lg font-semibold w-32">Stock</th>
                                    <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Separador Mouses */}
                                <tr className="bg-gradient-to-r from-indigo-600 to-purple-500">
                                    <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                        MOUSES GAMING
                                    </td>
                                </tr>

                                {/* Redragon M995 PRO */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">Redragon M995 PRO (FYZU PRO) 26000 DPI Wireless RGB</span>
                                            <button
                                                onClick={() => toggleSpecs('mouse-redragon-m995')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mouse-redragon-m995'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mouse-redragon-m995'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>DPI:</strong> hasta 26,000 (ajustable 50-26000)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Sensor:</strong> Pixart PAW3395 óptico</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tracking:</strong> 650 IPS, 50G aceleración</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Conectividad:</strong> Bluetooth, 2.4GHz Wireless, USB-C cable</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Botones:</strong> 6 programables con macros</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Switches:</strong> Huano (50 millones de clics)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Polling Rate:</strong> 1000Hz</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Batería:</strong> 400mAh</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Peso:</strong> 51g (ultraligero)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Dimensiones:</strong> 126 x 63.8 x 39.8 mm</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">
                                            2
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$80.000</td>
                                </tr>

                                {/* Razer DeathAdder Essential White */}
                                <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-800 font-medium">Razer DeathAdder Essential 6400 DPI</span>
                                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">BLANCO</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSpecs('mouse-razer-deathadder')}
                                                className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                {expandedSpecs['mouse-razer-deathadder'] ? '▲' : '▼'} Especificaciones
                                            </button>
                                        </div>
                                        {expandedSpecs['mouse-razer-deathadder'] && (
                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg specs-expand border border-blue-200">
                                                <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                                                    <span>⚙️</span> Especificaciones:
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>DPI:</strong> 6400 óptico de alta precisión</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Tracking:</strong> 220 IPS, 30G aceleración</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Conectividad:</strong> USB cable 1.8m</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Botones:</strong> 5 programables Hyperesponse</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Switches:</strong> Razer Mechanical (10 millones de clics)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Polling Rate:</strong> 1000Hz Ultrapolling</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Diseño:</strong> Ergonómico para diestros</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Iluminación:</strong> LED verde</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Peso:</strong> 96g</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Dimensiones:</strong> 127 x 73 x 43 mm</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-blue-600 font-bold">•</span>
                                                        <span><strong>Software:</strong> Razer Synapse 3</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                            15
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">$63.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Nota al pie */}
                <div className="mt-10 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#2b579a] shadow">
                    <p className="text-sm text-gray-700">
                        <strong className="text-[#2b579a]">📌 Nota:</strong> Todos los precios están sujetos a disponibilidad y pueden variar según el tipo de cambio (TRM).
                        Los combos incluyen productos seleccionados y ofrecen el mejor valor. Contáctanos para más información.
                    </p>
                </div>
            </div>

            {/* Modal Lightbox para imágenes */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] p-4">
                        {/* Botón cerrar */}
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute -top-2 -right-2 z-10 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors text-xl font-bold"
                        >
                            ✕
                        </button>
                        {/* Imagen */}
                        <img
                            src={lightboxImage.url}
                            alt={lightboxImage.alt}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        {/* Título de la imagen */}
                        <p className="text-center text-white mt-4 text-lg font-semibold">
                            {lightboxImage.alt}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListadoPrecios;
