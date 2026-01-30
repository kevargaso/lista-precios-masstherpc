import React from 'react';

// Página de construcción temporal
export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="text-center">
                {/* Logo / Icono */}
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-6xl">🖥️</span>
                </div>

                {/* Título */}
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    MesstherPC
                </h1>

                {/* Subtítulo */}
                <p className="text-xl md:text-2xl text-blue-200 mb-8">
                    Componentes de PC al mejor precio
                </p>

                {/* Badge de construcción */}
                <div className="inline-flex items-center gap-3 bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 px-6 py-3 rounded-full mb-12">
                    <span className="text-2xl">🚧</span>
                    <span className="font-semibold">Sitio en construcción</span>
                    <span className="text-2xl">🚧</span>
                </div>

                {/* CTA a lista de precios */}
                <div className="space-y-4">
                    <p className="text-gray-400">Mientras tanto, consulta nuestra lista de precios:</p>
                    <a
                        href="/lista-de-precios"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        💰 Ver Lista de Precios
                    </a>
                </div>

                {/* Footer mínimo */}
                <div className="mt-16 text-gray-500 text-sm">
                    <p>© 2026 MesstherPC - Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    );
}
