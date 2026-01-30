import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import PublicApp from './PublicApp';
import AdminPage from './components/admin/AdminPage';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* HOME - Página en construcción */}
                <Route path="/" element={<HomePage />} />

                {/* LISTA DE PRECIOS - Pública */}
                <Route path="/lista-de-precios" element={<PublicApp />} />

                {/* ADMIN - Protegido con login */}
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
            </Routes>
        </BrowserRouter>
    );
}
