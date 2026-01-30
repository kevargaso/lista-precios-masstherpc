import React from 'react';
import ListadoPrecios from './components/ListadoPrecios';

// VERSIÓN PÚBLICA - Solo muestra lista de precios
// El consolidado de pedidos está en /admin (protegido)
// Diseño GAMER profesional con tema oscuro
const PublicApp = () => {
    const TRM = 4150; // Actualizado

    const formatCurrency = (val, currency = 'COP') => {
        if (currency === 'USD') return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return `$${Math.round(val).toLocaleString('es-CO')}`;
    };

    return (
        <div className="min-h-screen bg-gamer-dark">
            <ListadoPrecios formatCurrency={formatCurrency} TRM={TRM} />
        </div>
    );
};

export default PublicApp;
