import React, { useState, useMemo } from 'react';
import { Save, Download, Printer, Copy, CheckCircle, Package, DollarSign } from 'lucide-react';

export default function ConsolidadoAdmin() {
    const TRM = 3850;
    const [docTitle, setDocTitle] = useState('Consolidado de Pedidos');
    const [copySuccess, setCopySuccess] = useState(false);

    // Estructura de datos
    const [consolidaciones, setConsolidaciones] = useState([
        {
            id: "LBX3148062",
            totalPeso: 10,
            costoEnvioTotalCOP: 224816,
            items: [
                {
                    guiaInterna: "LBX3148062",
                    order: "200014162247915",
                    tienda: "Walmart",
                    cliente: "Kevin",
                    producto: "Acer Nitro V 16 AI 16\" WUXGA",
                    cantidad: 1,
                    precioUnitarioUSD: 600,
                    pesoUnitario: 10,
                    tracking: "1LSCXLNA026513214"
                }
            ]
        },
        {
            id: "LBX3150707G",
            totalPeso: 17,
            costoEnvioTotalCOP: 355959,
            items: [
                {
                    guiaInterna: "LBX3150039",
                    order: "113-1860957-8904206",
                    tienda: "Amazon",
                    cliente: "Laura",
                    producto: "iPad Air M3 128GB Color Azul",
                    cantidad: 3,
                    precioUnitarioUSD: 400,
                    pesoUnitario: 2,
                    tracking: "1Z82AF320342463351"
                },
                {
                    guiaInterna: "LBX3149106",
                    order: "386900949",
                    tienda: "NewEgg",
                    cliente: "Laura",
                    producto: "Fuente de Poder Modular 850w",
                    cantidad: 2,
                    precioUnitarioUSD: 100,
                    pesoUnitario: 3,
                    tracking: "1Z44A2880330028401"
                }
            ]
        }
    ]);

    const formatCurrency = (value, currency = 'COP') => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const totals = useMemo(() => {
        let totalItems = 0;
        let totalUSD = 0;

        consolidaciones.forEach(c => {
            c.items.forEach(item => {
                totalItems += item.cantidad;
                totalUSD += item.cantidad * item.precioUnitarioUSD;
            });
        });

        const costoEnvioTotal = consolidaciones.reduce((acc, c) => acc + c.costoEnvioTotalCOP, 0);

        return {
            totalItems,
            totalUSD,
            totalCOP: totalUSD * TRM,
            costoEnvioTotal
        };
    }, [consolidaciones, TRM]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="text-xl font-bold text-gray-800 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 outline-none px-2"
                    />
                    <p className="text-sm text-gray-500">Gestión de pedidos en tránsito</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        ➕ Nueva Consolidación
                    </button>
                </div>
            </div>

            {/* Totales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Consolidaciones</p>
                            <p className="text-xl font-bold text-gray-800">{consolidaciones.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total USD</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(totals.totalUSD, 'USD')}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600">📦</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Items Totales</p>
                            <p className="text-xl font-bold text-purple-600">{totals.totalItems}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600">🚚</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Envío Total</p>
                            <p className="text-xl font-bold text-orange-600">{formatCurrency(totals.costoEnvioTotal)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Consolidaciones */}
            <div className="space-y-4">
                {consolidaciones.map((consolidacion, idx) => (
                    <div key={consolidacion.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header de consolidación */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <span className="font-mono font-bold">{consolidacion.id}</span>
                                <span className="text-sm opacity-80">Peso: {consolidacion.totalPeso} lb</span>
                            </div>
                            <span className="font-bold">Envío: {formatCurrency(consolidacion.costoEnvioTotalCOP)}</span>
                        </div>

                        {/* Items */}
                        <table className="w-full">
                            <thead className="bg-gray-50 text-xs text-gray-600">
                                <tr>
                                    <th className="px-4 py-2 text-left">Cliente</th>
                                    <th className="px-4 py-2 text-left">Producto</th>
                                    <th className="px-4 py-2 text-center">Qty</th>
                                    <th className="px-4 py-2 text-right">P. Unit USD</th>
                                    <th className="px-4 py-2 text-right">Total USD</th>
                                    <th className="px-4 py-2 text-left">Tienda</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {consolidacion.items.map((item, itemIdx) => (
                                    <tr key={itemIdx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{item.cliente}</td>
                                        <td className="px-4 py-3 text-gray-600">{item.producto}</td>
                                        <td className="px-4 py-3 text-center">{item.cantidad}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.precioUnitarioUSD, 'USD')}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                                            {formatCurrency(item.cantidad * item.precioUnitarioUSD, 'USD')}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{item.tienda}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}
