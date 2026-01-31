import React, { useState, useEffect } from 'react';
import { combosApi, comboItemsApi, productosApi, categoriasApi, storageApi } from '../../lib/supabase';
import { Package, Plus, Trash2, Edit, Image, DollarSign, X, Check, ChevronDown } from 'lucide-react';

export default function CombosAdmin({ onUpdate }) {
    const [combos, setCombos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCombo, setEditingCombo] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        imagen_url: '',
        activo: true
    });

    // Items del combo (productos seleccionados)
    const [comboItems, setComboItems] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [combosRes, categoriasRes, productosRes] = await Promise.all([
            combosApi.getAll(),
            categoriasApi.getAll(),
            productosApi.getAll()
        ]);

        if (combosRes.data) setCombos(combosRes.data);
        if (categoriasRes.data) setCategorias(categoriasRes.data);
        if (productosRes.data) setProductos(productosRes.data);
        setLoading(false);
    };

    // Obtener productos por categoría
    const getProductosByCategoria = (categoriaId) => {
        return productos.filter(p => p.categoria_id === categoriaId && p.activo);
    };

    // Calcular totales
    const calcularTotales = () => {
        const precioTotal = comboItems.reduce((sum, item) => sum + (item.precio_original || 0), 0);
        const descuentoTotal = comboItems.reduce((sum, item) => sum + (item.descuento || 0), 0);
        const precioFinal = precioTotal - descuentoTotal;
        return { precioTotal, descuentoTotal, precioFinal };
    };

    // Agregar categoría al combo
    const handleAddCategoria = (categoriaId) => {
        // Verificar que no esté ya agregada
        if (comboItems.find(item => item.categoria_id === categoriaId)) {
            alert('Esta categoría ya está en el combo');
            return;
        }

        const categoria = categorias.find(c => c.id === categoriaId);
        setComboItems(prev => [...prev, {
            categoria_id: categoriaId,
            categoria: categoria,
            producto_id: null,
            producto: null,
            precio_original: 0,
            descuento: 0,
            precio_final: 0
        }]);
    };

    // Seleccionar producto en una categoría
    const handleSelectProducto = (index, productoId) => {
        const producto = productos.find(p => p.id === productoId);
        if (!producto) return;

        setComboItems(prev => prev.map((item, i) => {
            if (i !== index) return item;
            return {
                ...item,
                producto_id: productoId,
                producto: producto,
                precio_original: producto.precio,
                precio_final: producto.precio - item.descuento
            };
        }));
    };

    // Actualizar descuento
    const handleUpdateDescuento = (index, descuento) => {
        const descuentoNum = parseFloat(descuento) || 0;
        setComboItems(prev => prev.map((item, i) => {
            if (i !== index) return item;
            return {
                ...item,
                descuento: descuentoNum,
                precio_final: item.precio_original - descuentoNum
            };
        }));
    };

    // Eliminar categoría del combo
    const handleRemoveCategoria = (index) => {
        setComboItems(prev => prev.filter((_, i) => i !== index));
    };

    // Subir imagen de portada
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const { data: url, error } = await storageApi.uploadImage(file, 'combo');

        if (!error && url) {
            setFormData(prev => ({ ...prev, imagen_url: url }));
        }
        setUploadingImage(false);
    };

    // Abrir modal nuevo
    const openNewModal = () => {
        setEditingCombo(null);
        setFormData({
            nombre: '',
            descripcion: '',
            imagen_url: '',
            activo: true
        });
        setComboItems([]);
        setShowModal(true);
    };

    // Abrir modal editar
    const openEditModal = (combo) => {
        setEditingCombo(combo);
        setFormData({
            nombre: combo.nombre,
            descripcion: combo.descripcion || '',
            imagen_url: combo.imagen_url || '',
            activo: combo.activo
        });

        // Cargar items del combo
        const items = (combo.items || []).map(item => ({
            categoria_id: item.categoria_id,
            categoria: item.categoria,
            producto_id: item.producto_id,
            producto: item.producto,
            precio_original: item.precio_original,
            descuento: item.descuento,
            precio_final: item.precio_final
        }));
        setComboItems(items);
        setShowModal(true);
    };

    // Guardar combo
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comboItems.length === 0) {
            alert('Debes agregar al menos un producto al combo');
            return;
        }

        // Verificar que todos los items tengan producto seleccionado
        const itemsSinProducto = comboItems.filter(item => !item.producto_id);
        if (itemsSinProducto.length > 0) {
            alert('Todos los items deben tener un producto seleccionado');
            return;
        }

        setSaving(true);

        const totales = calcularTotales();
        const comboData = {
            ...formData,
            precio_total: totales.precioTotal,
            descuento_total: totales.descuentoTotal,
            precio_final: totales.precioFinal
        };

        let comboId;

        if (editingCombo) {
            await combosApi.update(editingCombo.id, comboData);
            comboId = editingCombo.id;
        } else {
            const { data: newCombo } = await combosApi.create(comboData);
            comboId = newCombo?.id;
        }

        // Guardar items
        if (comboId) {
            const itemsToSave = comboItems.map(item => ({
                producto_id: item.producto_id,
                categoria_id: item.categoria_id,
                precio_original: item.precio_original,
                descuento: item.descuento,
                precio_final: item.precio_final
            }));
            await comboItemsApi.replaceItems(comboId, itemsToSave);
        }

        setSaving(false);
        setShowModal(false);
        loadData();
        onUpdate?.();
    };

    // Eliminar combo
    const handleDelete = async (id, nombre) => {
        if (confirm(`¿Eliminar el combo "${nombre}"?`)) {
            await combosApi.delete(id);
            loadData();
            onUpdate?.();
        }
    };

    // Formatear precio
    const formatCurrency = (value) => {
        return `$${Math.round(value || 0).toLocaleString('es-CO')}`;
    };

    // Categorías no usadas en el combo actual
    const categoriasDisponibles = categorias.filter(
        cat => !comboItems.find(item => item.categoria_id === cat.id)
    );

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="w-7 h-7 text-purple-600" />
                        Gestión de Combos
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Crea paquetes de productos con descuentos especiales
                    </p>
                </div>
                <button
                    onClick={openNewModal}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Combo
                </button>
            </div>

            {/* Lista de Combos */}
            <div className="grid gap-4">
                {combos.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">No hay combos creados</h3>
                        <p className="text-gray-400 mt-2">Crea tu primer combo de productos</p>
                    </div>
                ) : (
                    combos.map(combo => (
                        <div
                            key={combo.id}
                            className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!combo.activo ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-stretch">
                                {/* Imagen */}
                                <div className="w-40 h-32 bg-gray-100 flex-shrink-0">
                                    {combo.imagen_url ? (
                                        <img
                                            src={combo.imagen_url}
                                            alt={combo.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Image className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                                {combo.nombre}
                                                {!combo.activo && (
                                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {combo.items?.length || 0} productos
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-sm text-gray-400 line-through">
                                                {formatCurrency(combo.precio_total)}
                                            </div>
                                            <div className="text-xl font-bold text-green-600">
                                                {formatCurrency(combo.precio_final)}
                                            </div>
                                            <div className="text-xs text-purple-600 font-medium">
                                                Ahorro: {formatCurrency(combo.descuento_total)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items preview */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {combo.items?.slice(0, 5).map(item => (
                                            <span
                                                key={item.id}
                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1"
                                            >
                                                {item.categoria?.icono} {item.producto?.nombre || 'Sin producto'}
                                            </span>
                                        ))}
                                        {(combo.items?.length || 0) > 5 && (
                                            <span className="text-xs text-gray-400">
                                                +{combo.items.length - 5} más
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex flex-col justify-center gap-2 px-4 border-l bg-gray-50">
                                    <button
                                        onClick={() => openEditModal(combo)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(combo.id, combo.nombre)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Package className="w-6 h-6" />
                                {editingCombo ? 'Editar Combo' : 'Crear Combo'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-6">
                                {/* Datos básicos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre del Combo *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="Ej: PC Gamer Starter Pack"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            rows="2"
                                            placeholder="Descripción opcional del combo..."
                                        />
                                    </div>

                                    {/* Imagen de portada */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            📷 Imagen de Portada
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {formData.imagen_url && (
                                                <img
                                                    src={formData.imagen_url}
                                                    alt="Portada"
                                                    className="w-24 h-24 object-cover rounded-lg border"
                                                />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                            />
                                            {uploadingImage && <span className="text-sm text-purple-600">Subiendo...</span>}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.activo}
                                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-300 text-purple-600"
                                            />
                                            <span className="text-sm text-gray-700">Combo activo (visible en la lista)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Selector de Productos */}
                                <div className="border-t pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                            🛒 Productos del Combo
                                        </h4>

                                        {categoriasDisponibles.length > 0 && (
                                            <div className="relative">
                                                <select
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleAddCategoria(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    className="appearance-none pl-4 pr-10 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium cursor-pointer hover:bg-purple-100 transition-colors"
                                                >
                                                    <option value="">+ Agregar categoría</option>
                                                    {categoriasDisponibles.map(cat => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.icono} {cat.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600 pointer-events-none" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Items del combo */}
                                    <div className="space-y-3">
                                        {comboItems.length === 0 ? (
                                            <div className="text-center py-8 border-2 border-dashed rounded-lg text-gray-400">
                                                <p>Agrega categorías para seleccionar productos</p>
                                            </div>
                                        ) : (
                                            comboItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 rounded-lg p-4 border"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-medium text-gray-700 flex items-center gap-2">
                                                            {item.categoria?.icono} {item.categoria?.nombre}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCategoria(index)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                                        {/* Selector de producto */}
                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs text-gray-500 mb-1">Producto</label>
                                                            <select
                                                                value={item.producto_id || ''}
                                                                onChange={(e) => handleSelectProducto(index, e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                                                            >
                                                                <option value="">Seleccionar...</option>
                                                                {getProductosByCategoria(item.categoria_id).map(prod => (
                                                                    <option key={prod.id} value={prod.id}>
                                                                        {prod.nombre}{prod.etiqueta ? ` [${prod.etiqueta}]` : ''} - {formatCurrency(prod.precio)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Precio original */}
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">Precio</label>
                                                            <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                                                                {formatCurrency(item.precio_original)}
                                                            </div>
                                                        </div>

                                                        {/* Descuento */}
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">Descuento ($)</label>
                                                            <div className="relative">
                                                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <input
                                                                    type="number"
                                                                    value={item.descuento || ''}
                                                                    onChange={(e) => handleUpdateDescuento(index, e.target.value)}
                                                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                                                                    placeholder="0"
                                                                    min="0"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {item.producto_id && item.descuento > 0 && (
                                                        <div className="mt-2 text-right text-sm">
                                                            <span className="text-gray-400 line-through">{formatCurrency(item.precio_original)}</span>
                                                            <span className="text-green-600 font-bold ml-2">{formatCurrency(item.precio_final)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Totales */}
                                    {comboItems.length > 0 && (
                                        <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                                            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                                <span>Precio Total:</span>
                                                <span className="font-medium">{formatCurrency(calcularTotales().precioTotal)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-purple-600 mb-2">
                                                <span>Descuento Total:</span>
                                                <span className="font-medium">-{formatCurrency(calcularTotales().descuentoTotal)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xl font-bold text-green-600 pt-2 border-t border-purple-200">
                                                <span>Precio Final:</span>
                                                <span>{formatCurrency(calcularTotales().precioFinal)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || comboItems.length === 0}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>Guardando...</>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Guardar Combo
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
