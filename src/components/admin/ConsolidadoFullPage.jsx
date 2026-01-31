import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi, isSupabaseConfigured } from '../../lib/supabase';
import ConsolidadoFull from './ConsolidadoFull';

export default function ConsolidadoFullPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "MesstherPC | Consolidado Pedidos";
        checkSession();
    }, []);

    const checkSession = async () => {
        if (!isSupabaseConfigured()) {
            setLoading(false);
            return;
        }
        const { data: session } = await authApi.getSession();
        setUser(session?.user || null);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin" replace />;
    }

    return <ConsolidadoFull />;
}
