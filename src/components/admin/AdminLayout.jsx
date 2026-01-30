import React, { useState, useEffect } from 'react';
import { authApi, productosApi, categoriasApi } from '../../lib/supabase';
import ProductosAdmin from './ProductosAdmin';
import CategoriasAdmin from './CategoriasAdmin';

export default function AdminLayout({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('productos');
    const [stats, setStats] = useState({
        totalProductos: 0,
        productosActivos: 0,
        stockBajo: 0,
        categorias: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const { data: productos } = await productosApi.getAllAdmin();
        const { data: categorias } = await categoriasApi.getAll();

        if (productos) {
            setStats({
                totalProductos: productos.length,
                productosActivos: productos.filter(p => p.activo).length,
                stockBajo: productos.filter(p => p.stock <= 3 && p.stock > 0).length,
                categorias: categorias?.length || 0
            });
        }
    };

    const handleLogout = async () => {
        await authApi.signOut();
        onLogout();
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'productos', label: 'Productos', icon: '📦' },
        { id: 'categorias', label: 'Categorías', icon: '🏷️' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-xl">⚙️</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">Panel Admin</h1>
                                <p className="text-xs text-gray-500">Gestión de Productos</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                👤 {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📦</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Productos</p>
                                        <p className="text-2xl font-bold text-gray-800">{stats.totalProductos}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Activos</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.productosActivos}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">⚠️</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Stock Bajo</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.stockBajo}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🏷️</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Categorías</p>
                                        <p className="text-2xl font-bold text-purple-600">{stats.categorias}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setActiveTab('productos')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ➕ Agregar Producto
                                </button>
                                <a
                                    href="/"
                                    target="_blank"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    👁️ Ver Lista Pública
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Productos Tab */}
                {activeTab === 'productos' && (
                    <ProductosAdmin onUpdate={loadStats} />
                )}

                {/* Categorías Tab */}
                {activeTab === 'categorias' && (
                    <CategoriasAdmin onUpdate={loadStats} />
                )}
            </div>
        </div>
    );
}
