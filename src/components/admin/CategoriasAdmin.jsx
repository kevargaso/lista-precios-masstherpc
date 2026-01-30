import React, { useState, useEffect } from 'react';
import { categoriasApi } from '../../lib/supabase';

export default function CategoriasAdmin({ onUpdate }) {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        icono: '📦',
        orden: 0
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        setLoading(true);
        const { data } = await categoriasApi.getAll();
        if (data) setCategorias(data);
        setLoading(false);
    };

    const openNewModal = () => {
        setEditingCategoria(null);
        setFormData({ nombre: '', icono: '📦', orden: categorias.length });
        setShowModal(true);
    };

    const openEditModal = (categoria) => {
        setEditingCategoria(categoria);
        setFormData({
            nombre: categoria.nombre,
            icono: categoria.icono,
            orden: categoria.orden
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (editingCategoria) {
            await categoriasApi.update(editingCategoria.id, formData);
        } else {
            await categoriasApi.create(formData);
        }

        setSaving(false);
        setShowModal(false);
        loadCategorias();
        onUpdate?.();
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán sin categoría.')) {
            await categoriasApi.delete(id);
            loadCategorias();
            onUpdate?.();
        }
    };

    // Iconos sugeridos
    const iconosSugeridos = ['📦', '⚡', '🖥️', '💾', '🎮', '❄️', '🔌', '🔥', '👀', '🏷️', '🛒', '💻', '🖱️', '⌨️', '🎧'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Gestión de Categorías</h2>
                    <p className="text-sm text-gray-500">{categorias.length} categorías</p>
                </div>
                <button
                    onClick={openNewModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>➕</span> Nueva Categoría
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorias.map(categoria => (
                    <div
                        key={categoria.id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">{categoria.icono}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{categoria.nombre}</h3>
                                    <p className="text-sm text-gray-500">Orden: {categoria.orden}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => openEditModal(categoria)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(categoria.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {categorias.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <span className="text-4xl">🏷️</span>
                    <p className="mt-2 text-gray-500">No hay categorías creadas</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                    placeholder="Ej: Procesadores"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icono
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {iconosSugeridos.map(icono => (
                                        <button
                                            key={icono}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icono })}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${formData.icono === icono
                                                    ? 'bg-blue-600 ring-2 ring-blue-300'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            {icono}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={formData.icono}
                                    onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="O escribe un emoji"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Orden
                                </label>
                                <input
                                    type="number"
                                    value={formData.orden}
                                    onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
