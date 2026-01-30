// Componente DINÁMICO para mostrar el listado de precios desde Supabase
// Mantiene el diseño visual original con animaciones
import React, { useState, useEffect } from 'react';
import { productosApi, categoriasApi, galeriaApi, isSupabaseConfigured } from '../lib/supabase';

const ListadoPrecios = ({ formatCurrency, TRM }) => {
    // Estado para datos de Supabase
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para UI
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
    const [flash, setFlash] = useState(false);
    const [expandedSpecs, setExpandedSpecs] = useState({});
    // Lightbox con galería: { images: [], currentIndex: 0, productName: '' }
    const [lightbox, setLightbox] = useState(null);

    // Cargar datos de Supabase
    useEffect(() => {
        const fetchData = async () => {
            if (!isSupabaseConfigured()) {
                setError('Supabase no está configurado');
                setLoading(false);
                return;
            }

            try {
                const [categoriasRes, productosRes] = await Promise.all([
                    categoriasApi.getAll(),
                    productosApi.getAll()
                ]);

                if (categoriasRes.error) throw categoriasRes.error;
                if (productosRes.error) throw productosRes.error;

                setCategorias(categoriasRes.data || []);
                setProductos(productosRes.data || []);
            } catch (err) {
                console.error('Error cargando datos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Timer countdown effect
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

    // Flash effect
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

    // Agrupar productos por categoría
    const productosPorCategoria = categorias.reduce((acc, cat) => {
        acc[cat.id] = productos.filter(p => p.categoria_id === cat.id);
        return acc;
    }, {});

    // Obtener combos
    const combos = productos.filter(p => p.es_combo);
    const categoriasCombos = categorias.find(c => c.nombre === 'Combos');

    // Loading state
    if (loading) {
        return (
            <div className="bg-white mx-auto shadow-2xl min-h-[210mm] max-w-6xl p-6 md:p-10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando lista de precios...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white mx-auto shadow-2xl min-h-[210mm] max-w-6xl p-6 md:p-10 rounded-lg">
                <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">⚠️</span>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error cargando productos</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

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
                    50% { box-shadow: 0 0 20px rgba(255, 100, 0, 0.8), 0 0 40px rgba(255, 100, 0, 0.5); }
                }
                @keyframes bounce-rotate {
                    0%, 100% { transform: rotate(-3deg) scale(1); }
                    50% { transform: rotate(-5deg) scale(1.15); }
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
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .shimmer-text {
                    background: linear-gradient(90deg, #ff6b35, #ffd700, #ff0080, #00ff88, #ff6b35);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }
                .bounce-badge { animation: bounce-rotate 1s ease-in-out infinite; }
                .rainbow-border { animation: rainbow-border 2s linear infinite; }
                .float-effect { animation: float 2s ease-in-out infinite; }
                .gradient-animate { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
                .heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
            `}</style>

            {/* Header */}
            <div className="text-center mb-10 relative z-10">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#2b579a] to-[#1e3a8a] bg-clip-text text-transparent">
                    Listado de Precios al Público General
                </h1>
                <div className="flex justify-center items-center gap-8 text-sm text-gray-600 pb-4 border-b-2 border-gray-200">
                    <div><span className="font-bold text-black">TRM:</span> {formatCurrency(TRM, 'COP')}/USD</div>
                    <div>•</div>
                    <div><span className="font-bold text-black">Fecha:</span> {new Date().toLocaleDateString('es-CO')}</div>
                </div>

                {/* Nota sobre productos */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                    <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
                        <span className="text-2xl">📦</span>
                        <span>
                            <strong className="text-green-700">Todos los productos son nuevos y sellados en caja</strong>
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
                {/* SECCIÓN COMBOS */}
                {/* ============================================== */}
                {combos.length > 0 && (
                    <div className="category-section relative mt-4">
                        {/* Banner OFERTAS */}
                        <div className="absolute -top-4 -left-4 bounce-badge z-20">
                            <div className="bg-gradient-to-r from-red-600 via-pink-500 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-extrabold shadow-xl border-2 border-white">
                                🔥 ¡OFERTAS ESPECIALES! 🔥
                            </div>
                        </div>

                        {/* Descuento flotante */}
                        <div className="absolute -top-2 right-4 float-effect z-20">
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-black text-lg shadow-xl transform rotate-12 border-2 border-white">
                                -15%
                            </div>
                        </div>

                        {/* Timer */}
                        <div className="mb-6 mt-10">
                            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-xl ${flash ? 'bg-red-700' : 'bg-red-600'} text-white transition-all`}>
                                <span className="text-2xl heartbeat">⏰</span>
                                <span className="font-bold text-lg">¡OFERTA TERMINA EN:</span>
                                <div className="flex gap-1 font-mono text-2xl font-black">
                                    <span className="bg-black/30 px-3 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span>:</span>
                                    <span className="bg-black/30 px-3 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span>:</span>
                                    <span className="bg-black/30 px-3 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                </div>
                                <span className="text-2xl heartbeat">🔥</span>
                            </div>
                        </div>

                        {/* Título Combos */}
                        <div className="mb-6">
                            <h2 className="text-4xl font-black shimmer-text flex items-center gap-3">
                                🎁 COMBOS ESPECIALES 🎁
                            </h2>
                            <div className="h-2 w-48 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full mt-3 gradient-animate"></div>
                        </div>

                        {/* Tabla de Combos */}
                        <div className="combo-card border-4 rainbow-border rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-2 px-4 flex items-center justify-center gap-2 gradient-animate">
                                <span className="float-effect">⭐</span>
                                <span className="font-bold">¡ÚLTIMAS UNIDADES DISPONIBLES!</span>
                                <span className="float-effect">⭐</span>
                            </div>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
                                        <th className="px-6 py-5 text-left text-xl font-bold">🔥 Combo</th>
                                        <th className="px-6 py-5 text-center text-lg font-bold w-24">Stock</th>
                                        <th className="px-6 py-5 text-right text-xl font-bold w-56">Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {combos.map((combo, idx) => (
                                        <tr key={combo.id} className="border-b-2 border-orange-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 transition-all duration-300">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-orange-500 text-xl heartbeat">🎯</span>
                                                        <span className="text-gray-900 font-bold text-lg">{combo.nombre}</span>
                                                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold ml-2">HOT</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleSpecs(combo.id)}
                                                        className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                                    >
                                                        {expandedSpecs[combo.id] ? '▲' : '▼'} Detalles
                                                    </button>
                                                </div>
                                                {expandedSpecs[combo.id] && combo.especificaciones && (
                                                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                                                        <h4 className="font-bold text-[#2b579a] mb-3 text-lg">📦 Incluye:</h4>
                                                        <div className="space-y-2">
                                                            {combo.especificaciones.map((spec, i) => (
                                                                <div key={i} className="bg-white p-2 rounded border border-gray-200">
                                                                    <span className="font-semibold text-gray-700">{spec.label}:</span>{' '}
                                                                    <span className="text-gray-600">{spec.value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-center align-top">
                                                <span className={`px-3 py-1 rounded-full font-bold text-sm ${combo.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {combo.stock > 0 ? combo.stock : 'Agotado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right align-top">
                                                <div className="text-2xl font-black text-green-600">
                                                    {formatCurrency(combo.precio)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Banner inferior */}
                            <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white px-6 py-4 text-center gradient-animate">
                                <div className="flex items-center justify-center gap-4 flex-wrap">
                                    <span className="text-3xl float-effect">💰</span>
                                    <span className="font-black text-xl md:text-2xl tracking-wide">
                                        ¡AHORRA COMPRANDO EN COMBO!
                                    </span>
                                    <span className="text-3xl float-effect">🎉</span>
                                </div>
                                <div className="mt-2 text-sm opacity-90">
                                    🚀 CONTRAENTREGA BOGOTÁ • ⚡ Entrega en 24-48 horas
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================== */}
                {/* OTRAS CATEGORÍAS */}
                {/* ============================================== */}
                {categorias
                    .filter(cat => cat.nombre !== 'Combos')
                    .sort((a, b) => a.orden - b.orden)
                    .map(categoria => {
                        const productosCategoria = productosPorCategoria[categoria.id] || [];
                        if (productosCategoria.length === 0) return null;

                        // Agrupar por subcategoría si existe
                        const subcategorias = [...new Set(productosCategoria.map(p => p.subcategoria).filter(Boolean))];
                        const tieneSubcategorias = subcategorias.length > 0;

                        return (
                            <div key={categoria.id} id={categoria.nombre.toLowerCase().replace(/\s+/g, '-')} className="category-section mt-8">
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold text-[#2b579a] flex items-center gap-2">
                                        {categoria.icono} {categoria.nombre}
                                    </h2>
                                    <div className="h-1 w-24 bg-gradient-to-r from-[#2b579a] to-transparent rounded-full mt-1"></div>
                                </div>

                                <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-[#2b579a] to-[#3b82f6] text-white">
                                                <th className="px-6 py-4 text-left text-lg font-semibold">Producto</th>
                                                <th className="px-6 py-4 text-center text-lg font-semibold w-24">Stock</th>
                                                <th className="px-6 py-4 text-right text-lg font-semibold w-48">Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tieneSubcategorias ? (
                                                // Renderizar con subcategorías
                                                <>
                                                    {subcategorias.map(subcat => (
                                                        <React.Fragment key={subcat}>
                                                            {/* Header de subcategoría */}
                                                            <tr className="bg-gradient-to-r from-gray-700 to-gray-600">
                                                                <td colSpan="3" className="px-6 py-2 text-white font-bold text-center text-sm">
                                                                    {subcat}
                                                                </td>
                                                            </tr>
                                                            {/* Productos de la subcategoría */}
                                                            {productosCategoria
                                                                .filter(p => p.subcategoria === subcat)
                                                                .sort((a, b) => a.orden - b.orden)
                                                                .map(producto => (
                                                                    <ProductRow
                                                                        key={producto.id}
                                                                        producto={producto}
                                                                        formatCurrency={formatCurrency}
                                                                        expandedSpecs={expandedSpecs}
                                                                        toggleSpecs={toggleSpecs}
                                                                        onOpenGallery={setLightbox}
                                                                    />
                                                                ))}
                                                        </React.Fragment>
                                                    ))}
                                                    {/* Productos sin subcategoría */}
                                                    {productosCategoria
                                                        .filter(p => !p.subcategoria)
                                                        .sort((a, b) => a.orden - b.orden)
                                                        .map(producto => (
                                                            <ProductRow
                                                                key={producto.id}
                                                                producto={producto}
                                                                formatCurrency={formatCurrency}
                                                                expandedSpecs={expandedSpecs}
                                                                toggleSpecs={toggleSpecs}
                                                                onOpenGallery={setLightbox}
                                                            />
                                                        ))}
                                                </>
                                            ) : (
                                                // Sin subcategorías
                                                productosCategoria
                                                    .sort((a, b) => a.orden - b.orden)
                                                    .map(producto => (
                                                        <ProductRow
                                                            key={producto.id}
                                                            producto={producto}
                                                            formatCurrency={formatCurrency}
                                                            expandedSpecs={expandedSpecs}
                                                            toggleSpecs={toggleSpecs}
                                                            onOpenGallery={setLightbox}
                                                        />
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Lightbox con Galería Estilo MercadoLibre */}
            {lightbox && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    onClick={() => setLightbox(null)}
                >
                    <div className="relative w-full max-w-4xl h-full max-h-[85vh] flex rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>



                        {/* 1. Columna Thumbnails (Izquierda) */}
                        {lightbox.images.length > 1 && (
                            <div className="hidden md:flex flex-col w-20 h-full bg-black/40 backdrop-blur-sm border-r border-white/5">
                                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2 custom-scrollbar">
                                    {lightbox.images.map((img, idx) => (
                                        <button
                                            key={img.id || idx}
                                            onClick={() => setLightbox({ ...lightbox, currentIndex: idx })}
                                            className={`w-16 h-16 rounded-md overflow-hidden transition-all flex-shrink-0 relative group ${idx === lightbox.currentIndex
                                                ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900 opacity-100'
                                                : 'opacity-60 hover:opacity-100 ring-1 ring-white/10'
                                                }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Contenedor Principal Imagen (Derecha) - Ocupa el resto */}
                        <div className="flex-1 relative h-full bg-black flex items-center justify-center">

                            {/* Botón Cerrar - Esquina superior derecha ABSOLUTA del contenedor de imagen */}
                            <button
                                onClick={() => setLightbox(null)}
                                className="absolute top-4 right-4 z-50 w-10 h-10 bg-zinc-800/50 hover:bg-zinc-700 rounded-full flex items-center justify-center text-white text-xl transition-colors backdrop-blur-md border border-white/10"
                            >
                                ✕
                            </button>

                            {/* Flecha Izquierda */}
                            {lightbox.images.length > 1 && (
                                <button
                                    onClick={() => setLightbox({
                                        ...lightbox,
                                        currentIndex: lightbox.currentIndex === 0 ? lightbox.images.length - 1 : lightbox.currentIndex - 1
                                    })}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/50 text-white hover:text-blue-400 transition-all z-30"
                                >
                                    <span className="text-4xl pb-1">‹</span>
                                </button>
                            )}

                            {/* IMAGEN - Centrada al 100% */}
                            <div className="w-full h-full p-0 flex items-center justify-center">
                                <img
                                    src={lightbox.images[lightbox.currentIndex]?.url}
                                    alt={lightbox.productName}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            {/* Flecha Derecha */}
                            {lightbox.images.length > 1 && (
                                <button
                                    onClick={() => setLightbox({
                                        ...lightbox,
                                        currentIndex: lightbox.currentIndex === lightbox.images.length - 1 ? 0 : lightbox.currentIndex + 1
                                    })}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/50 text-white hover:text-blue-400 transition-all z-30"
                                >
                                    <span className="text-4xl pb-1">›</span>
                                </button>
                            )}

                            {/* Label Flotante Inferior */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-zinc-900/90 backdrop-blur text-white rounded-full text-sm border border-white/10 flex flex-col items-center gap-0.5 z-40 shadow-xl">
                                <span className="font-medium whitespace-nowrap">{lightbox.productName}</span>
                                {lightbox.images.length > 1 && (
                                    <span className="text-xs text-zinc-400">
                                        {lightbox.currentIndex + 1} / {lightbox.images.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails en Móvil (Bottom) */}
                        {lightbox.images.length > 1 && (
                            <div className="md:hidden absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/90 to-transparent flex items-end justify-center pb-6 px-4 overflow-x-auto z-50">
                                <div className="flex gap-2">
                                    {lightbox.images.map((img, idx) => (
                                        <button
                                            key={img.id || idx}
                                            onClick={() => setLightbox({ ...lightbox, currentIndex: idx })}
                                            className={`w-14 h-14 rounded-lg overflow-hidden border ${idx === lightbox.currentIndex
                                                ? 'border-blue-500 opacity-100 shadow-lg shadow-blue-500/20'
                                                : 'border-white/20 opacity-60'
                                                }`}
                                        >
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para fila de producto
const ProductRow = ({ producto, formatCurrency, expandedSpecs, toggleSpecs, onOpenGallery }) => {
    const [loadingGallery, setLoadingGallery] = useState(false);

    const handleImageClick = async () => {
        if (!producto.imagen_url) return;

        setLoadingGallery(true);
        // Cargar galería del producto
        const { data: gallery } = await galeriaApi.getByProducto(producto.id);

        // Si tiene galería, usar esas imágenes, sino usar imagen_url
        const images = gallery && gallery.length > 0
            ? gallery
            : [{ id: 'main', url: producto.imagen_url }];

        onOpenGallery({
            images,
            currentIndex: 0,
            productName: producto.nombre
        });
        setLoadingGallery(false);
    };

    return (
        <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Thumbnail - Clickeable */}
                        {producto.imagen_url ? (
                            <button
                                onClick={handleImageClick}
                                disabled={loadingGallery}
                                className="w-14 h-14 rounded-lg border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
                            >
                                {loadingGallery ? (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <span className="animate-spin">⏳</span>
                                    </div>
                                ) : (
                                    <img
                                        src={producto.imagen_url}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </button>
                        ) : (
                            <div className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-400 text-2xl">📷</span>
                            </div>
                        )}
                        <div>
                            <span className="text-gray-800 font-medium">{producto.nombre}</span>
                            {producto.etiqueta && (
                                <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                    {producto.etiqueta}
                                </span>
                            )}
                        </div>
                    </div>
                    {producto.especificaciones && producto.especificaciones.length > 0 && (
                        <button
                            onClick={() => toggleSpecs(producto.id)}
                            className="text-[#2b579a] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            {expandedSpecs[producto.id] ? '▲' : '▼'} Specs
                        </button>
                    )}
                </div>
                {expandedSpecs[producto.id] && producto.especificaciones && (
                    <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-[#2b579a] mb-2 flex items-center gap-2">
                            ⚙️ Especificaciones Técnicas:
                        </h4>
                        <ul className="space-y-1.5 text-sm text-gray-700">
                            {producto.especificaciones.map((spec, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span><strong>{spec.label}:</strong> {spec.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </td>
            <td className="px-6 py-4 text-center align-top">
                <span className={`px-3 py-1 rounded-full font-bold text-sm ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {producto.stock > 0 ? producto.stock : 'Agotado'}
                </span>
            </td>
            <td className="px-6 py-4 text-right align-top font-bold text-green-700 text-lg">
                {formatCurrency(producto.precio)}
            </td>
        </tr>
    );
};

export default ListadoPrecios;
