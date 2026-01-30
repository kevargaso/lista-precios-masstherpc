import React, { useState, useEffect } from 'react';
import { productosApi, categoriasApi, storageApi } from '../../lib/supabase';

export default function ProductosAdmin({ onUpdate }) {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        categoria_id: '',
        precio: '',
        stock: '',
        subcategoria: '',
        etiqueta: '',
        descripcion: '',
        especificaciones: [],
        activo: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [productosRes, categoriasRes] = await Promise.all([
            productosApi.getAllAdmin(),
            categoriasApi.getAll()
        ]);

        if (productosRes.data) setProductos(productosRes.data);
        if (categoriasRes.data) setCategorias(categoriasRes.data);
        setLoading(false);
    };

    const openNewModal = () => {
        setEditingProduct(null);
        setFormData({
            nombre: '',
            categoria_id: '',
            precio: '',
            stock: '',
            subcategoria: '',
            etiqueta: '',
            descripcion: '',
            especificaciones: [],
            activo: true
        });
        setImageFile(null);
        setShowModal(true);
    };

    const openEditModal = (producto) => {
        setEditingProduct(producto);
        setFormData({
            nombre: producto.nombre,
            categoria_id: producto.categoria_id || '',
            precio: producto.precio,
            stock: producto.stock,
            subcategoria: producto.subcategoria || '',
            etiqueta: producto.etiqueta || '',
            descripcion: producto.descripcion || '',
            especificaciones: producto.especificaciones || [],
            activo: producto.activo
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        let imagen_url = editingProduct?.imagen_url || null;

        // Upload nueva imagen si existe
        if (imageFile) {
            const { data: uploadUrl, error } = await storageApi.uploadImage(
                imageFile,
                formData.nombre.toLowerCase().replace(/\s+/g, '-')
            );
            if (!error && uploadUrl) {
                imagen_url = uploadUrl;
            }
        }

        const productoData = {
            ...formData,
            precio: parseFloat(formData.precio) || 0,
            stock: parseInt(formData.stock) || 0,
            imagen_url,
            categoria_id: formData.categoria_id || null
        };

        if (editingProduct) {
            await productosApi.update(editingProduct.id, productoData);
        } else {
            await productosApi.create(productoData);
        }

        setSaving(false);
        setShowModal(false);
        loadData();
        onUpdate?.();
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de desactivar este producto?')) {
            await productosApi.delete(id);
            loadData();
            onUpdate?.();
        }
    };

    const handleStockChange = async (id, nuevoStock) => {
        await productosApi.updateStock(id, parseInt(nuevoStock) || 0);
        loadData();
    };

    // Filtrar productos
    const filteredProductos = productos.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategoria = !filterCategoria || p.categoria_id === filterCategoria;
        return matchSearch && matchCategoria;
    });

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precio);
    };

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Gestión de Productos</h2>
                    <p className="text-sm text-gray-500">{productos.length} productos en total</p>
                </div>
                <button
                    onClick={openNewModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>➕</span> Agregar Producto
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="🔍 Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <select
                        value={filterCategoria}
                        onChange={(e) => setFilterCategoria(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icono} {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Producto</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Categoría</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Stock</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Precio</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Estado</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProductos.map(producto => (
                            <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {producto.imagen_url ? (
                                            <img
                                                src={producto.imagen_url}
                                                alt={producto.nombre}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400">📷</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-800">{producto.nombre}</p>
                                            {producto.etiqueta && (
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                    {producto.etiqueta}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {producto.categoria?.icono} {producto.categoria?.nombre || 'Sin categoría'}
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        value={producto.stock}
                                        onChange={(e) => handleStockChange(producto.id, e.target.value)}
                                        className={`w-20 px-2 py-1 text-center border rounded-lg ${producto.stock === 0 ? 'border-red-300 bg-red-50' :
                                                producto.stock <= 3 ? 'border-yellow-300 bg-yellow-50' :
                                                    'border-gray-300'
                                            }`}
                                        min="0"
                                    />
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-green-700">
                                    {formatPrecio(producto.precio)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${producto.activo
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => openEditModal(producto)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(producto.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Desactivar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProductos.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <span className="text-4xl">📦</span>
                        <p className="mt-2">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre del Producto *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <select
                                        value={formData.categoria_id}
                                        onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icono} {cat.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subcategoría
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subcategoria}
                                        onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: AMD RYZEN, DDR5, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio (COP) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Etiqueta
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.etiqueta}
                                        onChange={(e) => setFormData({ ...formData, etiqueta: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: BLISTER, BLANCA, NEGRO"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Imagen
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.activo}
                                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">Producto activo (visible en la lista)</span>
                                    </label>
                                </div>
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
                                    {saving ? 'Guardando...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
