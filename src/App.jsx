import React, { useState, useMemo } from 'react';
import { Save, Download, Printer, Copy, CheckCircle, Package, DollarSign, Menu } from 'lucide-react';
import ListadoPrecios from './components/ListadoPrecios';

const App = () => {
  const TRM = 3850;
  const [activeTab, setActiveTab] = useState('consolidado'); // 'consolidado' or 'precios'
  const [docTitle, setDocTitle] = useState('Consolidado de Pedidos');
  const [copySuccess, setCopySuccess] = useState(false);

  // Estructura de datos: Consolidado -> Items
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
          cliente: "Kevin",
          producto: "Combo (RAM + Board ASUS ROG STRIX B850-A GAMING WIFI R2 Blanca)",
          cantidad: 2,
          precioUnitarioUSD: 189.99,
          pesoUnitario: 5.5,
          tracking: "1ZR43Y850330991594"
        }
      ]
    },
    {
      id: "LBX3150708G",
      totalPeso: 22,
      costoEnvioTotalCOP: 449633,
      items: [
        {
          guiaInterna: "LBX3149997",
          order: "578809931",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Board ASUS TUF GAMING B850M-E WIFI",
          cantidad: 2,
          precioUnitarioUSD: 169.99,
          pesoUnitario: 4,
          tracking: "1ZR43Y850331191223"
        },
        {
          guiaInterna: "LBX3150338",
          order: "113-0331687-1745014",
          tienda: "Amazon",
          cliente: "Laura",
          producto: "iPad A16 11 Gen Color Rosa",
          cantidad: 3,
          precioUnitarioUSD: 279.99,
          pesoUnitario: 2,
          tracking: "1ZX341F40300845645"
        },
        {
          guiaInterna: "LBX3149796",
          order: "405473679",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Board ASUS TUF GAMING B850M-E WIFI",
          cantidad: 2,
          precioUnitarioUSD: 169.99,
          pesoUnitario: 4,
          tracking: "1ZE569860306925120"
        }
      ]
    },
    {
      id: "LBX3150706G",
      totalPeso: 24,
      costoEnvioTotalCOP: 487102,
      items: [
        {
          guiaInterna: "LBX3149349",
          order: "405456099",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Board ASUS TUF GAMING B850M-E WIFI",
          cantidad: 2,
          precioUnitarioUSD: 169.99,
          pesoUnitario: 4,
          tracking: "1ZE569860306858962"
        },
        {
          guiaInterna: "LBX3149361",
          order: "566957692",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Board ASUS B850 MAX GAMING WIFI W",
          cantidad: 2,
          precioUnitarioUSD: 159.99,
          pesoUnitario: 4,
          tracking: "1ZE569860306891121"
        },
        {
          guiaInterna: "LBX3149356",
          order: "405452439",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Board ASUS B850 MAX GAMING WIFI W",
          cantidad: 2,
          precioUnitarioUSD: 159.99,
          pesoUnitario: 4,
          tracking: "1ZE569860306852753"
        }
      ]
    },
    {
      id: "LBX3151388G",
      totalPeso: 36,
      costoEnvioTotalCOP: 721445,
      items: [
        {
          guiaInterna: "LBX3151040",
          order: "578950131",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Combo (16Gb RAM DDR4 y BOARD B550)",
          cantidad: 5,
          precioUnitarioUSD: 99.99,
          pesoUnitario: 3.2,
          tracking: "1ZR43Y850331396557"
        },
        {
          guiaInterna: "LBX3151074",
          order: "567165392",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Combo (RAM y BOARD ASUS ROG STRIX B850-A GAMING WIFI R2)",
          cantidad: 2,
          precioUnitarioUSD: 189.99,
          pesoUnitario: 5.5,
          tracking: "1ZR43Y850331244621"
        },
        {
          guiaInterna: "LBX3151072",
          order: "567250732",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Combo (DDR5 32GB RAM, BOARD ASRock B850I Lightning WiFi y COOLER)",
          cantidad: 2,
          precioUnitarioUSD: 369.99,
          pesoUnitario: 4.5,
          tracking: "1ZR43Y850331307143"
        }
      ]
    },
    {
      id: "LBX3151389G",
      totalPeso: 36,
      costoEnvioTotalCOP: 721445,
      items: [
        {
          guiaInterna: "LBX3151056",
          order: "558346294",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Board B550",
          cantidad: 5,
          precioUnitarioUSD: 99.99,
          pesoUnitario: 3,
          tracking: "1ZR43Y850331347654"
        },
        {
          guiaInterna: "LBX3151080",
          order: "578950131",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Combo (DDR5 32GB RAM, BOARD ASRock B850I Lightning WiFi y COOLER)",
          cantidad: 2,
          precioUnitarioUSD: 369.99,
          pesoUnitario: 4.5,
          tracking: "1ZR43Y850331397350"
        },
        {
          guiaInterna: "LBX3151099",
          order: "558179014",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Combo (RAM y BOARD ASUS ROG STRIX B850-A GAMING WIFI R2)",
          cantidad: 2,
          precioUnitarioUSD: 189.99,
          pesoUnitario: 5.5,
          tracking: "1ZR43Y850331232956"
        },
        {
          guiaInterna: "LBX3151346",
          order: "578809931",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Kit 16Gb RAM DDR5 (Parte de Combo LBX3149997)",
          cantidad: 2,
          precioUnitarioUSD: 0,
          pesoUnitario: 0.5,
          tracking: "1ZE569860307111015"
        }
      ]
    },
    {
      id: "LBX3151846G",
      totalPeso: 19,
      costoEnvioTotalCOP: 398693,
      items: [
        {
          guiaInterna: "LBX3151528",
          order: "558182914",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Combo (CPU Ryzen 9600x BOARD RAM COOLER )",
          cantidad: 1,
          precioUnitarioUSD: 319.99,
          pesoUnitario: 9.5,
          tracking: "1ZE569860307176867"
        },
        {
          guiaInterna: "LBX3151595",
          order: "578859431",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Combo (CPU Ryzen 9600x BOARD RAM COOLER )",
          cantidad: 1,
          precioUnitarioUSD: 319.99,
          pesoUnitario: 9.5,
          tracking: "1ZE569860307182298"
        }
      ]
    },
    {
      id: "LBX3150704G",
      totalPeso: 18,
      costoEnvioTotalCOP: 374694,
      items: [
        {
          guiaInterna: "LBX3148914",
          order: "-",
          tienda: "-",
          cliente: "-",
          producto: "Meta Quest 3 512GB",
          cantidad: 1,
          precioUnitarioUSD: 407.10,
          pesoUnitario: 3,
          tracking: "420331669339589677058529028454"
        },
        {
          guiaInterna: "LBX3149081",
          order: "405456099",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Kit 16Gb RAM DDR5 (Parte de combo con LBX3149349)",
          cantidad: 2,
          precioUnitarioUSD: 0,
          pesoUnitario: 0.5,
          tracking: "1ZR43Y850331015057"
        },
        {
          guiaInterna: "LBX3149083",
          order: "566957692",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Kit 16Gb RAM DDR5 (Parte de combo con LBX3149361)",
          cantidad: 2,
          precioUnitarioUSD: 0,
          pesoUnitario: 0.5,
          tracking: "1ZR43Y850331016770"
        },
        {
          guiaInterna: "LBX3149173",
          order: "405473679",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Combo (RAM y BOARD ASUS ROG STRIX B850-A GAMING WIFI R2)",
          cantidad: 2,
          precioUnitarioUSD: 189.99,
          pesoUnitario: 5.5,
          tracking: "1ZR43Y850331050929"
        },
        {
          guiaInterna: "LBX3149173",
          order: "405473679",
          tienda: "NewEgg",
          cliente: "Natalia",
          producto: "Kit 16Gb RAM DDR5 (Parte de combo con LBX3149796)",
          cantidad: 2,
          precioUnitarioUSD: 0,
          pesoUnitario: 0.5,
          tracking: "1ZR43Y850331050929"
        },
        {
          guiaInterna: "LBX3149399",
          order: "405452439",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Kit 16Gb RAM DDR5 (Parte de combo con LBX3149356)",
          cantidad: 2,
          precioUnitarioUSD: 0,
          pesoUnitario: 0.5,
          tracking: "1ZR43Y850331019759"
        }
      ]
    },
    {
      id: "LBX3151885G",
      totalPeso: 16,
      costoEnvioTotalCOP: 341737,
      items: [
        {
          guiaInterna: "LBX3151599",
          order: "113-9559246-9111420",
          tienda: "Amazon",
          cliente: "Laura",
          producto: "Ipad AIR M3 128GB COLOR GRIS",
          cantidad: 1,
          precioUnitarioUSD: 400.00,
          pesoUnitario: 2,
          tracking: "1ZX427651359428974"
        },
        {
          guiaInterna: "LBX3151748",
          order: "113-9053265-3036207 / 113-9559246-9111420",
          tienda: "Amazon",
          cliente: "Laura",
          producto: "Ipad AIR M3 128GB COLOR GRIS (Envío Cruzado)",
          cantidad: 2,
          precioUnitarioUSD: 400.00,
          pesoUnitario: 2,
          tracking: "1ZG1937J1315356161"
        },
        {
          guiaInterna: "LBX3151604",
          order: "558346294",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Combo (32Gb RAM DDR4 y BOARD B550)",
          cantidad: 2,
          precioUnitarioUSD: 209.99,
          pesoUnitario: 3.75,
          tracking: "1ZE569860307328103"
        },
        {
          guiaInterna: "LBX3151604",
          order: "558346294",
          tienda: "NewEgg",
          cliente: "Kevin",
          producto: "Kit 16Gb RAM DDR5 (Parte de combo con LBX3151056)",
          cantidad: 5,
          precioUnitarioUSD: 0,
          pesoUnitario: 0.5,
          tracking: "1ZE569860307328103"
        }
      ]
    }
  ]);

  const dataProcessed = useMemo(() => {
    let rows = [];
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

  const handlePrint = () => {
    // Intenta imprimir. Si falla (en algunos entornos sandbox), no hará nada,
    // pero el usuario puede usar Ctrl+P.
    window.print();
  };

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
        alert('No se pudo copiar automáticamente. Intenta seleccionar la tabla manualmente.');
      }
      window.getSelection().removeAllRanges();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans text-gray-800">
      {/* Estilos para impresión */}
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-content { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important;
            padding: 20px !important;
            border: none !important;
          }
          /* Asegurar que las celdas coloreadas se impriman */
          td, th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Barra de herramientas con navegación moderna (No se imprime) */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2b579a] to-[#3b82f6] text-white shadow-xl shrink-0 z-10 no-print">
        {/* Navegación por pestañas */}
        <div className="flex items-center justify-between px-6 pt-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pb-4">
              <Menu size={28} className="text-blue-200" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Sistema de Pedidos
              </h1>
            </div>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex items-center gap-2 px-6 pb-0">
          <button
            onClick={() => {
              setActiveTab('consolidado');
              setDocTitle('Consolidado de Pedidos');
            }}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-lg transition-all duration-300 ${activeTab === 'consolidado'
              ? 'bg-white text-[#2b579a] shadow-lg transform scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
          >
            <Package size={20} />
            Consolidado de Pedidos
          </button>
          <button
            onClick={() => {
              setActiveTab('precios');
              setDocTitle('Listado de Precios');
            }}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-lg transition-all duration-300 ${activeTab === 'precios'
              ? 'bg-white text-[#2b579a] shadow-lg transform scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
          >
            <DollarSign size={20} />
            Listado de Precios
          </button>
        </div>

        {/* Barra de herramientas */}
        <div className="bg-white text-gray-800 px-6 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[#2b579a]">{docTitle}</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyTable}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${copySuccess
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                }`}
            >
              {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copySuccess ? '¡Copiado!' : 'Copiar Tabla (Excel)'}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2b579a] to-[#1e3a8a] text-white hover:from-[#1e3a8a] hover:to-[#16315f] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
            >
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        {activeTab === 'consolidado' && (
          <>
            {/* El Papel (Clase print-content agregada para controlar impresión) */}
            <div className="bg-white mx-auto shadow-2xl min-h-[210mm] w-fit p-4 md:p-8 print-content rounded-lg">


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
          </>
        )}

        {activeTab === 'precios' && (
          <ListadoPrecios formatCurrency={formatCurrency} TRM={TRM} />
        )}

        {/* OLD CONTENT - REMOVE EVERYTHING UP TO LINE 745 */}
        {false && (
          <div className="bg-white mx-auto shadow-2xl min-h-[210mm] max-w-6xl p-6 md:p-10 print-content rounded-lg">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#2b579a] to-[#1e3a8a] bg-clip-text text-transparent">Listado de Precios al Público General</h1>
              <div className="flex justify-center items-center gap-8 text-sm text-gray-600 pb-4 border-b-2 border-gray-200">
                <div><span className="font-bold text-black">TRM:</span> {formatCurrency(TRM, 'COP')}/USD</div>
                <div>•</div>
                <div><span className="font-bold text-black">Fecha:</span> {new Date().toLocaleDateString('es-CO')}</div>
              </div>
            </div>

            {/* Sección de productos agrupados */}
            <div className="space-y-8">
              {/* Productos disponibles - extraídos del consolidado */}
              {(() => {
                // Agrupar productos únicos con sus costos
                const productosUnicos = new Map();

                dataProcessed.rows.forEach(row => {
                  const key = row.producto;
                  if (!productosUnicos.has(key)) {
                    productosUnicos.set(key, {
                      producto: row.producto,
                      costoUnitario: row.totalCostoUnitCOP,
                      precioUSD: row.precioUnitarioUSD,
                      tienda: row.tienda,
                      cantidad: row.cantidad
                    });
                  }
                });

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border-2 border-[#2b579a] rounded-lg overflow-hidden shadow-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#2b579a] to-[#1e3a8a] text-white text-center">
                          <th className="border border-[#1e3a8a] px-4 py-3 text-left">Producto</th>
                          <th className="border border-[#1e3a8a] px-4 py-3">Tienda</th>
                          <th className="border border-[#1e3a8a] px-4 py-3">Precio USD</th>
                          <th className="border border-[#1e3a8a] px-4 py-3">Costo Total<br />(COP)</th>
                          <th className="border border-[#1e3a8a] px-4 py-3 bg-[#70AD47]">Precio Público<br />(COP)</th>
                          <th className="border border-[#1e3a8a] px-4 py-3 bg-[#FFC000]">Margen<br />(%)</th>
                          <th className="border border-[#1e3a8a] px-4 py-3 bg-[#00B050]">Ganancia<br />(COP)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(productosUnicos.values()).map((item, index) => {
                          // Cálculos de ejemplo (el usuario puede editar estos valores)
                          const margenSugerido = 1.20; // 20% de margen
                          const precioPublico = Math.round(item.costoUnitario * margenSugerido);
                          const ganancia = precioPublico - item.costoUnitario;
                          const margenPorcentaje = ((ganancia / item.costoUnitario) * 100).toFixed(1);

                          return (
                            <tr key={index} className="hover:bg-blue-50 transition-colors">
                              <td className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-800">
                                {item.producto}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                                {item.tienda}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-blue-700">
                                {formatCurrency(item.precioUSD, 'USD')}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-right font-semibold bg-yellow-50">
                                {formatCurrency(item.costoUnitario)}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-right">
                                <input
                                  type="text"
                                  defaultValue={formatCurrency(precioPublico)}
                                  className="w-full text-right font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-center font-bold text-orange-700 bg-orange-50">
                                {margenPorcentaje}%
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-right font-bold text-green-700 bg-green-50">
                                {formatCurrency(ganancia)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* Notas informativas */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#2b579a] shadow-md">
                <h3 className="font-bold text-lg mb-3 text-[#2b579a]">📋 Notas Importantes:</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li><strong>Precio Público:</strong> Campo editable donde puedes ajustar el precio de venta según tu estrategia comercial.</li>
                  <li><strong>Margen (%):</strong> Se calcula automáticamente como: (Precio Público - Costo Total) / Costo Total × 100</li>
                  <li><strong>Ganancia:</strong> Diferencia entre el Precio Público y el Costo Total unitario.</li>
                  <li><strong>Costo Total:</strong> Incluye el precio del producto (convertido a COP) más el costo de envío prorrateado.</li>
                  <li>💡 <strong>Sugerencia:</strong> Se recomienda un margen mínimo del 15-20% para cubrir gastos operativos y obtener utilidad.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;