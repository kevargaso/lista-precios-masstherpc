import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicApp from './PublicApp';
import AdminPage from './components/admin/AdminPage';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* PÚBLICO - Solo lista de precios */}
                <Route path="/" element={<PublicApp />} />

                {/* ADMIN - Protegido con login */}
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
            </Routes>
        </BrowserRouter>
    );
}

