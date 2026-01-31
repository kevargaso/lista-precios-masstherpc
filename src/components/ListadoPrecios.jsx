// Componente DINÁMICO para mostrar el listado de precios desde Supabase
// Diseño GAMER profesional con tema oscuro, neón y animaciones premium
import React, { useState, useEffect } from 'react';
import { productosApi, categoriasApi, galeriaApi, combosApi, isSupabaseConfigured } from '../lib/supabase';
import ProductLightbox from './ui/ProductLightbox';
import {
    Package, Flame, Sparkles, Clock, Zap, CircleCheck, XCircle,
    Shield, ChevronDown, ChevronUp, Target, Gift, Cpu, Star,
    Timer, AlertTriangle, Box, Gamepad2, MonitorSpeaker
} from 'lucide-react';

const ListadoPrecios = ({ formatCurrency, TRM }) => {
    // Estado para datos de Supabase
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para UI
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
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
                const [categoriasRes, productosRes, combosRes] = await Promise.all([
                    categoriasApi.getAll(),
                    productosApi.getAll(),
                    combosApi.getActive()
                ]);

                if (categoriasRes.error) throw categoriasRes.error;
                if (productosRes.error) throw productosRes.error;
                if (combosRes.error) throw combosRes.error;

                setCategorias(categoriasRes.data || []);
                setProductos(productosRes.data || []);
                setCombos(combosRes.data || []);
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

    // Los combos ahora vienen del estado (cargados desde combosApi)

    // Mapeo de iconos por categoría
    const getCategoryIcon = (nombre) => {
        const icons = {
            'Procesadores': Cpu,
            'Tarjetas Gráficas': MonitorSpeaker,
            'Memorias RAM': Box,
            'Almacenamiento': Box,
            'Combos': Gift,
            'Periféricos': Gamepad2,
        };
        return icons[nombre] || Package;
    };

    // Loading state - GAMER Style
    if (loading) {
        return (
            <div className="bg-gamer-dark bg-cyber-grid min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-t-transparent border-neon-cyan rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-b-transparent border-neon-magenta rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                        <div className="absolute inset-4 border-4 border-t-transparent border-neon-violet rounded-full animate-spin" style={{ animationDuration: '0.5s' }}></div>
                        <Gamepad2 className="absolute inset-0 m-auto w-8 h-8 text-neon-cyan animate-neon-pulse" />
                    </div>
                    <p className="font-gaming text-xl text-neon-cyan tracking-widest animate-neon-pulse">
                        CARGANDO ARSENAL...
                    </p>
                </div>
            </div>
        );
    }

    // Error state - GAMER Style
    if (error) {
        return (
            <div className="bg-gamer-dark bg-cyber-grid min-h-screen flex items-center justify-center px-4">
                <div className="glass-gamer p-8 rounded-2xl border border-neon-red max-w-md text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-neon-red animate-neon-pulse" />
                    <h2 className="font-gaming text-2xl text-neon-red mb-2">ERROR CRÍTICO</h2>
                    <p className="text-gamer-secondary">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gamer-dark bg-cyber-grid min-h-screen relative overflow-hidden">
            {/* Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Glow Orbs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon-violet/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">

                {/* ============================================== */}
                {/* HEADER - GAMER STYLE */}
                {/* ============================================== */}
                <header className="text-center mb-12 pt-6">
                    {/* Main Title */}
                    <div className="relative inline-block">
                        <h1 className="font-gaming text-4xl md:text-5xl lg:text-6xl font-black text-gradient-gamer tracking-wider mb-4">
                            LISTA DE PRECIOS
                        </h1>
                        {/* Decorative Lines */}
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <div className="h-0.5 w-16 md:w-24 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
                            <Gamepad2 className="w-6 h-6 text-neon-cyan animate-neon-pulse" />
                            <div className="h-0.5 w-16 md:w-24 bg-gradient-to-l from-transparent via-neon-cyan to-transparent"></div>
                        </div>
                    </div>

                    {/* Info Bar */}
                    <div className="flex justify-center items-center gap-6 md:gap-10 mt-8 text-sm md:text-base">
                        <div className="glass-gamer px-4 py-2 rounded-lg border border-neon-cyan/30">
                            <span className="font-gaming text-neon-cyan">TRM:</span>
                            <span className="text-white ml-2 font-semibold">{formatCurrency(TRM, 'COP')}/USD</span>
                        </div>
                        <div className="glass-gamer px-4 py-2 rounded-lg border border-neon-violet/30">
                            <span className="font-gaming text-neon-violet">FECHA:</span>
                            <span className="text-white ml-2 font-semibold">{new Date().toLocaleDateString('es-CO')}</span>
                        </div>
                    </div>

                    {/* Product Notice */}
                    <div className="mt-8 glass-gamer p-4 md:p-5 rounded-xl border border-neon-green/30 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <Box className="w-6 h-6 text-neon-green animate-neon-pulse" />
                            <span className="font-gaming-alt text-lg font-semibold text-white">
                                Productos <span className="text-neon-green">NUEVOS</span> y <span className="text-neon-green">SELLADOS</span> en caja
                            </span>
                            <CircleCheck className="w-6 h-6 text-neon-green animate-neon-pulse" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <Shield className="w-5 h-5 text-neon-cyan" />
                            <span className="font-gaming-alt text-neon-cyan font-semibold">
                                6 MESES DE GARANTÍA
                            </span>
                            <span className="text-gamer-muted text-sm">por defectos de fábrica</span>
                        </div>
                    </div>
                </header>

                <div className="space-y-10">

                    {/* ============================================== */}
                    {/* SECCIÓN COMBOS - GAMER SPECIAL */}
                    {/* ============================================== */}
                    {combos.length > 0 && (
                        <section className="relative">
                            {/* Floating Badges */}
                            <div className="absolute -top-4 left-4 md:left-8 z-20 animate-float">
                                <div className="glass-gamer px-4 py-2 rounded-full border-2 border-neon-magenta shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <Flame className="w-5 h-5 text-neon-orange animate-fire" />
                                        <span className="font-gaming text-sm text-neon-magenta tracking-wider">¡OFERTAS ESPECIALES!</span>
                                        <Flame className="w-5 h-5 text-neon-orange animate-fire" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-2 right-4 md:right-8 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
                                <div className="bg-gradient-to-r from-neon-orange to-neon-red px-4 py-2 rounded-full font-gaming text-black font-bold text-lg shadow-lg transform rotate-6">
                                    -15%
                                </div>
                            </div>

                            {/* Main Card */}
                            <div className="glass-gamer rounded-2xl border border-neon-magenta/50 overflow-hidden pt-12 mt-6">

                                {/* Timer Section */}
                                <div className="px-6 py-6 flex flex-col items-center">
                                    <div className="led-display flex items-center gap-4 px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Timer className="w-6 h-6 text-neon-orange animate-heartbeat" />
                                            <span className="font-gaming text-neon-orange text-sm tracking-wider hidden md:inline">OFERTA TERMINA EN:</span>
                                        </div>
                                        <div className="flex gap-2 font-gaming text-2xl md:text-3xl">
                                            <div className="led-segment">{String(timeLeft.hours).padStart(2, '0')}</div>
                                            <span className="text-neon-orange animate-led">:</span>
                                            <div className="led-segment">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                            <span className="text-neon-orange animate-led">:</span>
                                            <div className="led-segment">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                        </div>
                                        <Flame className="w-6 h-6 text-neon-orange animate-fire" />
                                    </div>
                                </div>

                                {/* Section Title */}
                                <div className="px-6 pb-4">
                                    <h2 className="font-gaming text-3xl md:text-4xl text-gradient-fire flex items-center gap-3">
                                        <Gift className="w-8 h-8 text-neon-orange" />
                                        COMBOS ESPECIALES
                                    </h2>
                                    <div className="h-1 w-48 bg-gradient-to-r from-neon-orange via-neon-red to-neon-magenta rounded-full mt-3"></div>
                                </div>

                                {/* Alert Banner */}
                                <div className="bg-gradient-to-r from-neon-orange/20 via-neon-red/20 to-neon-magenta/20 border-y border-neon-orange/30 py-3 px-6">
                                    <div className="flex items-center justify-center gap-3">
                                        <Sparkles className="w-5 h-5 text-neon-orange animate-neon-pulse" />
                                        <span className="font-gaming-alt text-white font-semibold tracking-wide">¡ÚLTIMAS UNIDADES DISPONIBLES!</span>
                                        <Sparkles className="w-5 h-5 text-neon-orange animate-neon-pulse" />
                                    </div>
                                </div>

                                {/* Combos Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-neon-orange/20 via-neon-red/20 to-neon-magenta/20">
                                                <th className="px-6 py-4 text-left font-gaming text-neon-orange tracking-wide">
                                                    <Flame className="inline w-5 h-5 mr-2" />COMBO
                                                </th>
                                                <th className="px-6 py-4 text-center font-gaming text-neon-orange tracking-wide w-28">STOCK</th>
                                                <th className="px-6 py-4 text-right font-gaming text-neon-orange tracking-wide w-48">PRECIO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {combos.map((combo) => (
                                                <tr
                                                    key={combo.id}
                                                    className="border-b border-neon-orange/20 hover:bg-neon-orange/5 transition-all duration-300 group"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                {combo.imagen_url ? (
                                                                    <img
                                                                        src={combo.imagen_url}
                                                                        alt={combo.nombre}
                                                                        className="w-12 h-12 object-cover rounded-lg border border-neon-orange/30 cursor-pointer hover:border-neon-cyan transition-colors hover:scale-110"
                                                                        onClick={() => setLightbox({
                                                                            images: [{ url: combo.imagen_url, id: combo.id }],
                                                                            currentIndex: 0,
                                                                            productName: combo.nombre
                                                                        })}
                                                                    />
                                                                ) : (
                                                                    <Target className="w-5 h-5 text-neon-orange group-hover:animate-neon-pulse" />
                                                                )}
                                                                <span className="text-white font-semibold text-lg group-hover:text-neon-cyan transition-colors">
                                                                    {combo.nombre}
                                                                </span>
                                                                {combo.descuento_total > 0 && (
                                                                    <span className="badge-hot text-xs">-{formatCurrency(combo.descuento_total)}</span>
                                                                )}
                                                            </div>
                                                            {combo.items && combo.items.length > 0 && (
                                                                <button
                                                                    onClick={() => toggleSpecs(combo.id)}
                                                                    className="btn-gamer text-sm flex items-center gap-2 py-2 px-3"
                                                                >
                                                                    {expandedSpecs[combo.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                    Detalles
                                                                </button>
                                                            )}
                                                        </div>
                                                        {expandedSpecs[combo.id] && combo.items && (
                                                            <div className="mt-4 glass-dark p-5 rounded-xl border border-neon-cyan/30 animate-slide-up">
                                                                <h4 className="font-gaming text-neon-cyan mb-3 flex items-center gap-2">
                                                                    <Package className="w-5 h-5" />
                                                                    INCLUYE:
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {combo.items.map((item, i) => (
                                                                        <div key={i} className="bg-gamer-surface/50 p-3 rounded-lg border border-gamer-border flex justify-between items-center">
                                                                            <div>
                                                                                <span className="text-neon-violet font-semibold">{item.categoria?.icono} {item.categoria?.nombre}:</span>
                                                                                <span className="text-gamer-secondary ml-2">{item.producto?.nombre}</span>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                {item.descuento > 0 && (
                                                                                    <span className="text-gray-500 line-through text-sm mr-2">{formatCurrency(item.precio_original)}</span>
                                                                                )}
                                                                                <span className="text-neon-green font-semibold">{formatCurrency(item.precio_final)}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 text-center align-top">
                                                        <div className="text-sm text-neon-cyan">
                                                            {combo.items?.length || 0} items
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right align-top">
                                                        {combo.descuento_total > 0 && (
                                                            <div className="text-sm text-gray-500 line-through">
                                                                {formatCurrency(combo.precio_total)}
                                                            </div>
                                                        )}
                                                        <div className="font-gaming text-2xl text-neon-green glow-text-cyan">
                                                            {formatCurrency(combo.precio_final)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Bottom Banner */}
                                <div className="bg-gradient-to-r from-neon-orange via-neon-red to-neon-magenta p-1">
                                    <div className="bg-gamer-dark px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-4 flex-wrap">
                                            <Zap className="w-7 h-7 text-neon-orange animate-neon-pulse" />
                                            <span className="font-gaming text-xl md:text-2xl text-white tracking-wide">
                                                ¡AHORRA COMPRANDO EN <span className="text-neon-orange">COMBO</span>!
                                            </span>
                                            <Zap className="w-7 h-7 text-neon-orange animate-neon-pulse" />
                                        </div>
                                        <p className="text-gamer-secondary mt-2 font-gaming-alt">
                                            🚀 CONTRAENTREGA BOGOTÁ • ⚡ Entrega en 24-48 horas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ============================================== */}
                    {/* OTRAS CATEGORÍAS - GAMER STYLE */}
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
                            const CategoryIcon = getCategoryIcon(categoria.nombre);

                            return (
                                <section
                                    key={categoria.id}
                                    id={categoria.nombre.toLowerCase().replace(/\s+/g, '-')}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${categoria.orden * 0.1}s` }}
                                >
                                    {/* Category Header */}
                                    <div className="mb-5 flex items-center gap-4">
                                        <div className="p-3 bg-gamer-elevated rounded-xl border border-neon-cyan/30">
                                            <CategoryIcon className="w-7 h-7 text-neon-cyan" />
                                        </div>
                                        <div>
                                            <h2 className="font-gaming text-2xl md:text-3xl text-white flex items-center gap-3">
                                                {categoria.nombre}
                                            </h2>
                                            <div className="h-1 w-32 bg-gradient-to-r from-neon-cyan to-neon-violet rounded-full mt-2"></div>
                                        </div>
                                    </div>

                                    {/* Category Table */}
                                    <div className="glass-gamer rounded-xl border border-neon-cyan/30 overflow-hidden hover-glow-cyan transition-all duration-300">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-neon-cyan/20 via-neon-violet/10 to-neon-cyan/20">
                                                    <th className="px-6 py-4 text-left font-gaming text-neon-cyan tracking-wide text-sm">PRODUCTO</th>
                                                    <th className="px-6 py-4 text-center font-gaming text-neon-cyan tracking-wide text-sm w-28">STOCK</th>
                                                    <th className="px-6 py-4 text-right font-gaming text-neon-cyan tracking-wide text-sm w-44">PRECIO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tieneSubcategorias ? (
                                                    <>
                                                        {subcategorias.map(subcat => (
                                                            <React.Fragment key={subcat}>
                                                                {/* Subcategory Header */}
                                                                <tr className="bg-gradient-to-r from-gamer-elevated to-gamer-surface">
                                                                    <td colSpan="3" className="px-6 py-3 text-center">
                                                                        <span className="font-gaming text-sm text-neon-violet tracking-wider">
                                                                            ─── {subcat} ───
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                                {/* Products in subcategory */}
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
                                                        {/* Products without subcategory */}
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
                                                    // No subcategories
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
                                </section>
                            );
                        })}
                </div>

                {/* Footer */}
                <footer className="mt-16 mb-8 text-center">
                    <div className="glass-gamer p-6 rounded-xl border border-gamer-border max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/50"></div>
                            <Gamepad2 className="w-6 h-6 text-neon-cyan animate-neon-pulse" />
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/50"></div>
                        </div>
                        <p className="text-gamer-secondary font-gaming-alt">
                            Precios sujetos a cambio sin previo aviso • Todos los productos incluyen garantía
                        </p>
                    </div>
                </footer>
            </div>

            {/* Lightbox Componente Reutilizable */}
            <ProductLightbox
                isOpen={!!lightbox}
                images={lightbox?.images || []}
                currentIndex={lightbox?.currentIndex || 0}
                productName={lightbox?.productName || ''}
                onClose={() => setLightbox(null)}
                onChangeIndex={(newIndex) => setLightbox({ ...lightbox, currentIndex: newIndex })}
            />
        </div>
    );
};

// Stock Badge Component
const StockBadge = ({ stock }) => {
    if (stock > 0) {
        return (
            <span className="badge-gamer badge-success flex items-center gap-1.5 justify-center">
                <CircleCheck className="w-4 h-4" />
                {stock}
            </span>
        );
    }
    return (
        <span className="badge-gamer badge-danger flex items-center gap-1.5 justify-center">
            <XCircle className="w-4 h-4" />
            Agotado
        </span>
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
        <tr className="border-b border-gamer-border hover:bg-neon-cyan/5 transition-all duration-300 group">
            <td className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Thumbnail - Clickeable */}
                        {producto.imagen_url ? (
                            <button
                                onClick={handleImageClick}
                                disabled={loadingGallery}
                                className="w-16 h-16 rounded-xl border-2 border-gamer-border overflow-hidden hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0 bg-gamer-surface group/img"
                            >
                                {loadingGallery ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-t-transparent border-neon-cyan rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <img
                                        src={producto.imagen_url}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                    />
                                )}
                            </button>
                        ) : (
                            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gamer-border bg-gamer-surface flex items-center justify-center flex-shrink-0">
                                <Package className="w-6 h-6 text-gamer-muted" />
                            </div>
                        )}
                        <div>
                            <span className="text-white font-semibold group-hover:text-neon-cyan transition-colors">
                                {producto.nombre}
                            </span>
                            {producto.etiqueta && (
                                <span className="ml-3 badge-gamer badge-warning">
                                    <Star className="w-3 h-3 inline mr-1" />
                                    {producto.etiqueta}
                                </span>
                            )}
                        </div>
                    </div>
                    {producto.especificaciones && producto.especificaciones.length > 0 && (
                        <button
                            onClick={() => toggleSpecs(producto.id)}
                            className="btn-gamer text-xs flex items-center gap-1.5 py-1.5 px-3"
                        >
                            {expandedSpecs[producto.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            Specs
                        </button>
                    )}
                </div>
                {expandedSpecs[producto.id] && producto.especificaciones && (
                    <div className="mt-4 glass-dark p-4 rounded-xl border border-neon-violet/30 animate-slide-up">
                        <h4 className="font-gaming text-sm text-neon-violet mb-3 flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            ESPECIFICACIONES TÉCNICAS
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {producto.especificaciones.map((spec, i) => (
                                <li key={i} className="flex items-start gap-2 text-gamer-secondary">
                                    <span className="text-neon-cyan mt-0.5">▸</span>
                                    <span><strong className="text-white">{spec.label}:</strong> {spec.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </td>
            <td className="px-6 py-4 text-center align-top">
                <StockBadge stock={producto.stock} />
            </td>
            <td className="px-6 py-4 text-right align-top">
                <div className="font-gaming text-xl text-neon-green group-hover:glow-text-cyan transition-all">
                    {formatCurrency(producto.precio)}
                </div>
            </td>
        </tr>
    );
};

export default ListadoPrecios;
