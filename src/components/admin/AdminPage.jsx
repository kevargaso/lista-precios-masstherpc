import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import { authApi, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "MesstherPC | Panel Admin";
        checkSession();

        // Escuchar cambios de autenticación
        const { data: { subscription } } = authApi.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkSession = async () => {
        const { data: session } = await authApi.getSession();
        setUser(session?.user || null);
        setLoading(false);
    };

    // Mostrar mensaje si Supabase no está configurado
    if (!isSupabaseConfigured()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Configuración Requerida</h1>
                    <p className="text-gray-600 mb-6">
                        El panel de administración requiere configurar Supabase.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-gray-800 mb-2">Pasos para configurar:</h3>
                        <ol className="text-sm text-gray-600 space-y-2">
                            <li>1. Crea un proyecto en <a href="https://supabase.com" target="_blank" className="text-blue-600 hover:underline">supabase.com</a></li>
                            <li>2. Copia tu URL y Anon Key del proyecto</li>
                            <li>3. Crea un archivo <code className="bg-gray-200 px-1 rounded">.env</code> en la raíz del proyecto:</li>
                        </ol>
                        <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                            {`VITE_SUPABASE_URL=tu_url_aqui
VITE_SUPABASE_ANON_KEY=tu_key_aqui`}
                        </pre>
                        <p className="mt-3 text-xs text-gray-500">
                            4. Ejecuta el archivo <code className="bg-gray-200 px-1 rounded">supabase/schema.sql</code> en el SQL Editor de Supabase
                        </p>
                    </div>

                    <a
                        href="/"
                        className="inline-block mt-6 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        ← Volver a la lista de precios
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <AdminLogin onLogin={setUser} />;
    }

    return <AdminLayout user={user} onLogout={() => setUser(null)} />;
}
