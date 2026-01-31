import React, { useState, useMemo } from 'react';
import { Download, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ConsolidadoFull() {
    const navigate = useNavigate();
    const TRM = 3850;
    const [copySuccess, setCopySuccess] = useState(false);

    // Mismos datos del App.jsx original
    const [consolidaciones] = useState([
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
                    cliente: "Kevin",
                    producto: "Combo (RAM + Board)",
                    cantidad: 2,
                    precioUnitarioUSD: 189.99,
                    pesoUnitario: 5.5,
                    tracking: "1ZR43Y850330991594"
                }
            ]
        }
    ]);

    const dataProcessed = useMemo(() => {
        const rows = [];
        let grandTotalProdUSD = 0;
        let grandTotalProdCOP = 0;
        let grandTotalEnvio = 0;

        consolidaciones.forEach(cons => {
            const costoPorLibra = cons.totalPeso > 0 ? cons.costoEnvioTotalCOP / cons.totalPeso : 0;

            cons.items.forEach((item, index) => {
                const totalProdUSD = item.precioUnitarioUSD * item.cantidad;
                const totalProdCOP = totalProdUSD * TRM;
                const precioUnitCOP = item.precioUnitarioUSD * TRM;
                const costoEnvioUnitCOP = costoPorLibra * item.pesoUnitario;
                const costoEnvioTotalItemCOP = costoEnvioUnitCOP * item.cantidad;
                const totalCostoUnitCOP = precioUnitCOP + costoEnvioUnitCOP;

                grandTotalProdUSD += totalProdUSD;
                grandTotalProdCOP += totalProdCOP;
                grandTotalEnvio += costoEnvioTotalItemCOP;

                rows.push({
                    consolidadoId: cons.id,
                    costoEnvioConsolidado: cons.costoEnvioTotalCOP,
                    isFirstOfGroup: index === 0,
                    rowSpan: cons.items.length,
                    ...item,
                    totalProdUSD,
                    totalProdCOP,
                    precioUnitCOP,
                    costoEnvioUnitCOP,
                    totalCostoUnitCOP
                });
            });
        });

        return { rows, totals: { grandTotalProdUSD, grandTotalProdCOP, grandTotalEnvio } };
    }, [consolidaciones]);

    const formatCurrency = (val, currency = 'COP') => {
        if (currency === 'USD') return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return `$${Math.round(val).toLocaleString('es-CO')}`;
    };

    const handlePrint = () => window.print();

    const handleCopyTable = () => {
        const table = document.querySelector('table');
        if (table) {
            const range = document.createRange();
            range.selectNode(table);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            try {
                document.execCommand('copy');
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 3000);
            } catch (err) {
                alert('No se pudo copiar automáticamente.');
            }
            window.getSelection().removeAllRanges();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <style>{`
                @media print {
                    @page { margin: 0; size: landscape; }
                    body { background: white; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .no-print { display: none !important; }
                    .print-content { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
                    td, th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2b579a] to-[#3b82f6] text-white px-6 py-4 no-print">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Volver al Admin
                        </button>
                        <h1 className="text-2xl font-bold">Consolidado de Pedidos (Tabla Completa)</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyTable}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${copySuccess
                                ? 'bg-green-600 text-white'
                                : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                        >
                            {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                            {copySuccess ? '¡Copiado!' : 'Copiar (Excel)'}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-white text-[#2b579a] px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                        >
                            <Download size={16} /> Exportar PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-auto">
                <div className="bg-white mx-auto shadow-lg p-6 print-content rounded-lg">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2 uppercase text-black">Consolidado de Pedidos</h1>
                        <div className="flex justify-center items-center gap-8 text-sm text-gray-600 border-b pb-4 border-gray-300">
                            <div><span className="font-bold text-black">TRM:</span> {formatCurrency(TRM, 'COP')}/USD</div>
                            <div>|</div>
                            <div><span className="font-bold text-black">Fecha:</span> {new Date().toLocaleDateString('es-CO')}</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-[10px] border-collapse border border-black font-arial whitespace-nowrap">
                            <thead>
                                <tr className="text-white text-center h-12">
                                    <th className="bg-[#4472C4] border border-black px-1">Guía Cons.</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Guía Interna</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Tracking</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Order #</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Tienda</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Cliente</th>
                                    <th className="bg-[#4472C4] border border-black px-1 w-48">Producto</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Cant.</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Total Prod.<br />(USD)</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Total Prod.<br />(COP)</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Precio Unit.<br />(USD)</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Precio Unit.<br />(COP)</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Costo Envío<br />Total (Cons)</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Costo Envío<br />Unit.</th>
                                    <th className="bg-[#4472C4] border border-black px-1">Total Costo<br />Unit.</th>
                                    <th className="bg-[#70AD47] border border-black px-1 w-24">Precio Venta<br />Unit. (COP)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataProcessed.rows.map((row, index) => (
                                    <tr key={index} className="text-xs hover:bg-gray-50">
                                        {row.isFirstOfGroup ? (
                                            <td
                                                className="border border-black p-1 text-center font-bold align-middle bg-gray-50"
                                                rowSpan={row.rowSpan}
                                            >
                                                {row.consolidadoId}
                                            </td>
                                        ) : null}
                                        <td className="border border-black p-1 text-center">{row.guiaInterna}</td>
                                        <td className="border border-black p-1 text-center text-gray-500 text-[9px]">{row.tracking || '-'}</td>
                                        <td className="border border-black p-1 text-center">{row.order}</td>
                                        <td className="border border-black p-1 text-center">{row.tienda}</td>
                                        <td className="border border-black p-1 text-center">{row.cliente}</td>
                                        <td className="border border-black p-1 text-left truncate max-w-[200px]" title={row.producto}>{row.producto}</td>
                                        <td className="border border-black p-1 text-center">{row.cantidad}</td>
                                        <td className="border border-black p-1 text-right font-medium text-blue-800 bg-blue-50">{formatCurrency(row.totalProdUSD, 'USD')}</td>
                                        <td className="border border-black p-1 text-right text-blue-800 bg-blue-50">{formatCurrency(row.totalProdCOP)}</td>
                                        <td className="border border-black p-1 text-right">{formatCurrency(row.precioUnitarioUSD, 'USD')}</td>
                                        <td className="border border-black p-1 text-right text-gray-600">{formatCurrency(row.precioUnitCOP)}</td>
                                        {row.isFirstOfGroup ? (
                                            <td
                                                className="border border-black p-1 text-right align-middle bg-gray-100 font-bold"
                                                rowSpan={row.rowSpan}
                                            >
                                                {formatCurrency(row.costoEnvioConsolidado)}
                                            </td>
                                        ) : null}
                                        <td className="border border-black p-1 text-right font-medium">{formatCurrency(row.costoEnvioUnitCOP)}</td>
                                        <td className="border border-black p-1 text-right font-bold bg-yellow-50">{formatCurrency(row.totalCostoUnitCOP)}</td>
                                        <td className="bg-[#E2EFDA] border border-black p-1 text-right outline-none focus:bg-green-200 transition-colors" contentEditable></td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-[#4472C4] text-white h-10">
                                    <td colSpan="8" className="border border-black p-2 text-right uppercase">Totales Generales:</td>
                                    <td className="border border-black p-1 text-right">{formatCurrency(dataProcessed.totals.grandTotalProdUSD, 'USD')}</td>
                                    <td className="border border-black p-1 text-right">{formatCurrency(dataProcessed.totals.grandTotalProdCOP)}</td>
                                    <td colSpan="2" className="border border-black bg-[#365b9d]"></td>
                                    <td className="border border-black p-1 text-right">{formatCurrency(dataProcessed.totals.grandTotalEnvio)}</td>
                                    <td colSpan="2" className="border border-black bg-[#365b9d]"></td>
                                    <td className="bg-[#70AD47] border border-black"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-sm text-gray-700">
                        <h3 className="font-bold mb-2">Notas de Liquidación:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                            <li><strong>Costo Envío Unitario:</strong> Calculado proporcionalmente según el peso de cada item dentro de su Guía Consolidada.</li>
                            <li><strong>Total Costo Unit.:</strong> Suma del Precio Unitario (COP) + Costo de Envío Unitario. Este es el punto de equilibrio.</li>
                            <li><strong>Guía Consolidada:</strong> Agrupa múltiples guías internas para optimizar el costo de envío.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
