-- =====================================================
-- MIGRACIÓN DE PRODUCTOS - LISTADO DE PRECIOS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Limpiar datos de ejemplo anteriores
DELETE FROM productos;
DELETE FROM combo_productos;

-- =====================================================
-- CATEGORÍAS (ya existentes, actualizar orden)
-- =====================================================
UPDATE categorias SET orden = 1 WHERE nombre = 'Combos';
UPDATE categorias SET orden = 2, icono = '💻' WHERE nombre = 'Procesadores';
INSERT INTO categorias (nombre, icono, orden) 
VALUES ('Portátiles', '💻', 3)
ON CONFLICT DO NOTHING;
UPDATE categorias SET orden = 4, icono = '🖥️' WHERE nombre = 'Motherboards';
UPDATE categorias SET orden = 5, icono = '🧠' WHERE nombre = 'Memoria RAM';
UPDATE categorias SET orden = 6, icono = '💾' WHERE nombre = 'Almacenamiento';
UPDATE categorias SET orden = 7, icono = '🎮' WHERE nombre = 'Tarjetas Gráficas';
UPDATE categorias SET orden = 8, icono = '❄️' WHERE nombre = 'Refrigeración';
UPDATE categorias SET orden = 9, icono = '⚡' WHERE nombre = 'Fuentes de Poder';

-- =====================================================
-- PRODUCTOS
-- =====================================================

DO $$
DECLARE
    cat_combos UUID;
    cat_portatiles UUID;
    cat_procesadores UUID;
    cat_motherboards UUID;
    cat_ram UUID;
    cat_almacenamiento UUID;
    cat_gpus UUID;
    cat_refrigeracion UUID;
    cat_fuentes UUID;
BEGIN
    -- Obtener IDs de categorías
    SELECT id INTO cat_combos FROM categorias WHERE nombre = 'Combos';
    SELECT id INTO cat_portatiles FROM categorias WHERE nombre = 'Portátiles';
    SELECT id INTO cat_procesadores FROM categorias WHERE nombre = 'Procesadores';
    SELECT id INTO cat_motherboards FROM categorias WHERE nombre = 'Motherboards';
    SELECT id INTO cat_ram FROM categorias WHERE nombre = 'Memoria RAM';
    SELECT id INTO cat_almacenamiento FROM categorias WHERE nombre = 'Almacenamiento';
    SELECT id INTO cat_gpus FROM categorias WHERE nombre = 'Tarjetas Gráficas';
    SELECT id INTO cat_refrigeracion FROM categorias WHERE nombre = 'Refrigeración';
    SELECT id INTO cat_fuentes FROM categorias WHERE nombre = 'Fuentes de Poder';

    -- =====================================================
    -- COMBOS
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, es_combo, imagen_url, especificaciones, orden)
    VALUES 
    (cat_combos, 'CPU RYZEN 5 9600X + KIT RGB DDR5 16GB (8X2) 6000 MHZ + BOARD B850 + R. LIQUIDA 240 RGB', 2350000, 3, true, '/images/productos/combo-ryzen-9600x.webp',
     '[{"label":"Procesador","value":"AMD Ryzen 5 9600X"},{"label":"Motherboard","value":"MSI B850 GAMING PLUS WIFI"},{"label":"RAM","value":"Team Group 16GB DDR5 6000 MHz"},{"label":"Cooler","value":"AIO 240mm RGB"}]'::jsonb, 1),
    
    (cat_combos, 'BOARD B850 + 16GB DDR5 RGB + AIO 240', 1350000, 5, true, '/images/productos/combo-b850-tuf-ram.webp',
     '[{"label":"Motherboard","value":"ASUS TUF GAMING B850M-E WIFI"},{"label":"RAM","value":"16GB DDR5 6000 MHz RGB"},{"label":"Cooler","value":"AIO 240mm RGB"}]'::jsonb, 2),
    
    (cat_combos, 'BOARD B850 ROG + 16GB DDR5 RGB', 850000, 8, true, '/images/productos/combo-b850-rog-ram.webp',
     '[{"label":"Motherboard","value":"ASUS ROG STRIX B850-A GAMING WIFI R2"},{"label":"RAM","value":"16GB DDR5 6000 MHz RGB"}]'::jsonb, 3),
    
    (cat_combos, 'BOARD B550 TUF + 32GB DDR4 RGB', 720000, 4, true, '/images/productos/combo-b550-tuf-32gb.webp',
     '[{"label":"Motherboard","value":"ASUS TUF GAMING B550-PLUS WIFI II"},{"label":"RAM","value":"G.SKILL Ripjaws V 32GB DDR4 3200MHz"}]'::jsonb, 4),
    
    (cat_combos, 'BOARD B550 + 16GB DDR4', 450000, 10, true, '/images/productos/combo-b550-16gb.webp',
     '[{"label":"Motherboard","value":"ASUS PRIME B550M-A WiFi II"},{"label":"RAM","value":"CORSAIR Vengeance LPX 16GB DDR4 3200MHz"}]'::jsonb, 5);

    -- =====================================================
    -- PORTÁTILES
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, imagen_url, especificaciones, orden)
    VALUES 
    (cat_portatiles, 'Acer Nitro V 16 AI 16" WUXGA IPS 180Hz Gaming Laptop', 3199900, 1, NULL,
     '[{"label":"Procesador","value":"AMD Ryzen AI 5 240"},{"label":"GPU","value":"NVIDIA GeForce RTX 5050 8GB GDDR7"},{"label":"RAM","value":"16GB DDR5"},{"label":"Almacenamiento","value":"512GB PCIe Gen 4 SSD"},{"label":"Pantalla","value":"16\" WUXGA 1920x1200 180Hz"}]'::jsonb, 1);

    -- =====================================================
    -- PROCESADORES AMD
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_procesadores, 'AMD Ryzen 5 9600X', 840000, 5, 'AMD RYZEN', '/images/productos/ryzen-9600x.webp',
     '[{"label":"Núcleos/Hilos","value":"6 núcleos / 12 hilos"},{"label":"Frecuencia Base","value":"3.9 GHz"},{"label":"Frecuencia Turbo","value":"hasta 5.4 GHz"},{"label":"TDP","value":"65W"},{"label":"Arquitectura","value":"Zen 5"}]'::jsonb, 1),
    
    (cat_procesadores, 'AMD Ryzen 5 7600X', 680000, 3, 'AMD RYZEN', '/images/productos/ryzen-7600x.webp',
     '[{"label":"Núcleos/Hilos","value":"6 núcleos / 12 hilos"},{"label":"Frecuencia Base","value":"4.7 GHz"},{"label":"Frecuencia Turbo","value":"hasta 5.3 GHz"},{"label":"TDP","value":"105W"},{"label":"Arquitectura","value":"Zen 4"}]'::jsonb, 2),
    
    (cat_procesadores, 'AMD Ryzen 7 9800X3D', 1850000, 2, 'AMD RYZEN', '/images/productos/ryzen-9800x3d.webp',
     '[{"label":"Núcleos/Hilos","value":"8 núcleos / 16 hilos"},{"label":"Frecuencia Base","value":"4.7 GHz"},{"label":"Frecuencia Turbo","value":"hasta 5.2 GHz"},{"label":"3D V-Cache","value":"96MB L3"},{"label":"TDP","value":"120W"},{"label":"Arquitectura","value":"Zen 5 + 3D V-Cache"}]'::jsonb, 3);

    -- PROCESADORES INTEL
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_procesadores, 'Intel Core Ultra 7 265K', 1550000, 2, 'INTEL', '/images/productos/intel-265k.webp',
     '[{"label":"Núcleos/Hilos","value":"20 núcleos (8P + 12E) / 28 hilos"},{"label":"Frecuencia Base P-Core","value":"3.9 GHz"},{"label":"Frecuencia Turbo","value":"hasta 5.5 GHz"},{"label":"TDP","value":"125W"},{"label":"Arquitectura","value":"Arrow Lake"},{"label":"Gráficos","value":"Intel Arc Graphics integrado"}]'::jsonb, 4),
    
    (cat_procesadores, 'Intel Core Ultra 7 265KF', 1450000, 3, 'INTEL', '/images/productos/intel-265kf.webp',
     '[{"label":"Núcleos/Hilos","value":"20 núcleos (8P + 12E) / 28 hilos"},{"label":"Frecuencia Base P-Core","value":"3.9 GHz"},{"label":"Frecuencia Turbo","value":"hasta 5.5 GHz"},{"label":"TDP","value":"125W"},{"label":"Arquitectura","value":"Arrow Lake"},{"label":"Nota","value":"Sin gráficos integrados"}]'::jsonb, 5);

    -- =====================================================
    -- MOTHERBOARDS AMD
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_motherboards, 'ASUS PRIME B550M-A WiFi II', 360000, 8, 'AMD - Socket AM4', '/images/productos/mb-b550m-a.webp',
     '[{"label":"Formato","value":"Micro-ATX"},{"label":"Socket","value":"AM4"},{"label":"Chipset","value":"AMD B550"},{"label":"RAM","value":"DDR4, 4 slots, hasta 128GB"},{"label":"WiFi","value":"WiFi 6"},{"label":"M.2","value":"2 x M.2 NVMe"}]'::jsonb, 1),
    
    (cat_motherboards, 'ASUS ROG STRIX B550-F GAMING WIFI II', 520000, 4, 'AMD - Socket AM4', '/images/productos/mb-b550-f.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"AM4"},{"label":"Chipset","value":"AMD B550"},{"label":"RAM","value":"DDR4, 4 slots, hasta 128GB"},{"label":"WiFi","value":"WiFi 6E"},{"label":"M.2","value":"2 x M.2 NVMe con heatsink"}]'::jsonb, 2),
    
    (cat_motherboards, 'ASUS TUF GAMING B550-PLUS WIFI II', 450000, 6, 'AMD - Socket AM4', '/images/productos/mb-b550-plus.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"AM4"},{"label":"Chipset","value":"AMD B550"},{"label":"RAM","value":"DDR4, 4 slots, hasta 128GB"},{"label":"WiFi","value":"WiFi 6"},{"label":"M.2","value":"2 x M.2 NVMe"}]'::jsonb, 3),
    
    (cat_motherboards, 'ASUS TUF GAMING B850M-E WIFI', 650000, 10, 'AMD - Socket AM5', '/images/productos/mb-b850m-e.webp',
     '[{"label":"Formato","value":"Micro-ATX"},{"label":"Socket","value":"AM5"},{"label":"Chipset","value":"AMD B850"},{"label":"RAM","value":"DDR5, 2 slots, hasta 128GB"},{"label":"WiFi","value":"WiFi 7"},{"label":"M.2","value":"2 x M.2 NVMe Gen5"}]'::jsonb, 4),
    
    (cat_motherboards, 'ASUS ROG STRIX B850-A GAMING WIFI R2', 720000, 8, 'AMD - Socket AM5', '/images/productos/mb-b850-a.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"AM5"},{"label":"Chipset","value":"AMD B850"},{"label":"RAM","value":"DDR5, 4 slots, hasta 256GB"},{"label":"WiFi","value":"WiFi 7"},{"label":"M.2","value":"4 x M.2 NVMe"}]'::jsonb, 5),
    
    (cat_motherboards, 'ASUS B850 MAX GAMING WIFI W', 620000, 5, 'AMD - Socket AM5', '/images/productos/mb-b850-max.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"AM5"},{"label":"Chipset","value":"AMD B850"},{"label":"RAM","value":"DDR5, 4 slots"},{"label":"WiFi","value":"WiFi 7"},{"label":"Color","value":"Blanca"}]'::jsonb, 6),
    
    (cat_motherboards, 'MSI B850 GAMING PLUS WIFI', 750000, 4, 'AMD - Socket AM5', '/images/productos/mb-msi-b850.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"AM5"},{"label":"Chipset","value":"AMD B850"},{"label":"RAM","value":"DDR5, 4 slots, hasta 256GB"},{"label":"WiFi","value":"WiFi 7"},{"label":"M.2","value":"4 x M.2 NVMe"}]'::jsonb, 7),
    
    (cat_motherboards, 'MSI PRO B650-S WIFI', 480000, 3, 'AMD - Socket AM5', '/images/productos/mb-msi-b650.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"AM5"},{"label":"Chipset","value":"AMD B650"},{"label":"RAM","value":"DDR5, 4 slots"},{"label":"WiFi","value":"WiFi 6E"}]'::jsonb, 8);

    -- MOTHERBOARDS INTEL
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_motherboards, 'Gigabyte Z890 AORUS Elite AX', 920000, 2, 'INTEL - Socket LGA1851', '/images/productos/mb-z890-aorus.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"LGA1851"},{"label":"Chipset","value":"Intel Z890"},{"label":"RAM","value":"DDR5, 4 slots"},{"label":"WiFi","value":"WiFi 7"}]'::jsonb, 9),
    
    (cat_motherboards, 'MSI MPG Z890 Edge TI WiFi', 1100000, 2, 'INTEL - Socket LGA1851', '/images/productos/mb-z890-edge.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"LGA1851"},{"label":"Chipset","value":"Intel Z890"},{"label":"RAM","value":"DDR5, 4 slots"},{"label":"WiFi","value":"WiFi 7"},{"label":"Color","value":"Blanca"}]'::jsonb, 10),
    
    (cat_motherboards, 'ASRock Z890 Steel Legend WiFi', 850000, 3, 'INTEL - Socket LGA1851', '/images/productos/mb-z890-asrock.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"LGA1851"},{"label":"Chipset","value":"Intel Z890"},{"label":"RAM","value":"DDR5, 4 slots"},{"label":"WiFi","value":"WiFi 7"}]'::jsonb, 11),
    
    (cat_motherboards, 'MSI Z790-P WIFI DDR5', 650000, 4, 'INTEL - Socket LGA1700', '/images/productos/mb-z790-p.webp',
     '[{"label":"Formato","value":"ATX"},{"label":"Socket","value":"LGA1700"},{"label":"Chipset","value":"Intel Z790"},{"label":"RAM","value":"DDR5, 4 slots"},{"label":"WiFi","value":"WiFi 6E"}]'::jsonb, 12);

    -- =====================================================
    -- MEMORIA RAM DDR4
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_ram, 'CORSAIR Vengeance LPX 16GB (2 x 8GB) DDR4 3200MHz', 180000, 10, 'DDR4', '/images/productos/ram-corsair-16.webp',
     '[{"label":"Capacidad","value":"16GB (2 x 8GB)"},{"label":"Velocidad","value":"3200 MHz"},{"label":"Latencia","value":"CL16"},{"label":"Voltaje","value":"1.35V"},{"label":"Tipo","value":"288-Pin DDR4"}]'::jsonb, 1),
    
    (cat_ram, 'G.SKILL Ripjaws V Series 32GB (2 x 16GB) DDR4 3200MHz', 280000, 6, 'DDR4', '/images/productos/ram-gskill-32.webp',
     '[{"label":"Capacidad","value":"32GB (2 x 16GB)"},{"label":"Velocidad","value":"3200 MHz"},{"label":"Latencia","value":"CL16"},{"label":"Voltaje","value":"1.35V"},{"label":"Color","value":"Negro"}]'::jsonb, 2);

    -- MEMORIA RAM DDR5
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, etiqueta, imagen_url, especificaciones, orden)
    VALUES 
    (cat_ram, 'Team Group 16GB (2 x 8GB) DDR5 6000 MHz', 320000, 8, 'DDR5', 'NEGRA', '/images/productos/ram-team-black.webp',
     '[{"label":"Capacidad","value":"16GB (2 x 8GB)"},{"label":"Velocidad","value":"6000 MHz"},{"label":"Latencia","value":"CL38"},{"label":"RGB","value":"Sí"},{"label":"Color","value":"Negro"}]'::jsonb, 3),
    
    (cat_ram, 'Team Group 16GB (2 x 8GB) DDR5 6000 MHz', 320000, 8, 'DDR5', 'BLANCA', '/images/productos/ram-team-white.webp',
     '[{"label":"Capacidad","value":"16GB (2 x 8GB)"},{"label":"Velocidad","value":"6000 MHz"},{"label":"Latencia","value":"CL38"},{"label":"RGB","value":"Sí"},{"label":"Color","value":"Blanco"}]'::jsonb, 4),
    
    (cat_ram, 'VCOLOR Prism II RGB 32GB (2 x 16GB) DDR5 6000MHz', 420000, 4, 'DDR5', NULL, '/images/productos/ram-vcolor-32.webp',
     '[{"label":"Capacidad","value":"32GB (2 x 16GB)"},{"label":"Velocidad","value":"6000 MHz"},{"label":"Latencia","value":"CL36"},{"label":"RGB","value":"Sí, ARGB"}]'::jsonb, 5);

    -- =====================================================
    -- ALMACENAMIENTO
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_almacenamiento, 'WD Black SN850X 1TB NVMe', 380000, 5, 'SSD NVMe', '/images/productos/ssd-wd-1tb.webp',
     '[{"label":"Capacidad","value":"1TB"},{"label":"Interfaz","value":"PCIe Gen4 x4"},{"label":"Lectura","value":"7300 MB/s"},{"label":"Escritura","value":"6300 MB/s"},{"label":"TBW","value":"600 TBW"}]'::jsonb, 1),
    
    (cat_almacenamiento, 'Samsung 990 Pro 1TB NVMe', 420000, 4, 'SSD NVMe', '/images/productos/ssd-samsung-1tb.webp',
     '[{"label":"Capacidad","value":"1TB"},{"label":"Interfaz","value":"PCIe Gen4 x4"},{"label":"Lectura","value":"7450 MB/s"},{"label":"Escritura","value":"6900 MB/s"},{"label":"TBW","value":"600 TBW"}]'::jsonb, 2),
    
    (cat_almacenamiento, 'Samsung 990 Pro 2TB NVMe', 680000, 3, 'SSD NVMe', '/images/productos/ssd-samsung-2tb.webp',
     '[{"label":"Capacidad","value":"2TB"},{"label":"Interfaz","value":"PCIe Gen4 x4"},{"label":"Lectura","value":"7450 MB/s"},{"label":"Escritura","value":"6900 MB/s"},{"label":"TBW","value":"1200 TBW"}]'::jsonb, 3);

    -- =====================================================
    -- TARJETAS GRÁFICAS
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_gpus, 'AMD Radeon RX 9070 XT', 2800000, 2, 'AMD RADEON', '/images/productos/gpu-rx9070xt.webp',
     '[{"label":"VRAM","value":"16GB GDDR6"},{"label":"Arquitectura","value":"RDNA 4"},{"label":"Ray Tracing","value":"Sí, 2da Gen"},{"label":"Conectores","value":"3x DisplayPort 2.1, 1x HDMI 2.1"},{"label":"TDP","value":"300W"}]'::jsonb, 1);

    -- =====================================================
    -- REFRIGERACIÓN
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_refrigeracion, 'Cooler Master Hyper 212 RGB', 120000, 12, 'REFRIGERACIÓN POR AIRE', '/images/productos/cooler-hyper212.webp',
     '[{"label":"Tipo","value":"Torre"},{"label":"TDP","value":"150W"},{"label":"Ventilador","value":"120mm RGB"},{"label":"Compatible","value":"Intel LGA1700, AMD AM5/AM4"}]'::jsonb, 1),
    
    (cat_refrigeracion, 'ZALMAN CNPS10X Optima II RGB', 95000, 8, 'REFRIGERACIÓN POR AIRE', '/images/productos/cooler-zalman.webp',
     '[{"label":"Tipo","value":"Torre"},{"label":"TDP","value":"180W"},{"label":"Ventilador","value":"120mm RGB"},{"label":"Compatible","value":"Intel LGA1700, AMD AM5/AM4"}]'::jsonb, 2),
    
    (cat_refrigeracion, 'MONTECH HyperFlow ARGB 240mm', 280000, 6, 'REFRIGERACIÓN LÍQUIDA', '/images/productos/cooler-montech240.webp',
     '[{"label":"Tipo","value":"AIO Líquida"},{"label":"Radiador","value":"240mm"},{"label":"Ventiladores","value":"2x 120mm ARGB"},{"label":"TDP","value":"250W+"},{"label":"Compatible","value":"Intel LGA1700, AMD AM5/AM4"}]'::jsonb, 3),
    
    (cat_refrigeracion, 'MONTECH HyperFlow ARGB 120mm', 180000, 4, 'REFRIGERACIÓN LÍQUIDA', '/images/productos/cooler-montech120.webp',
     '[{"label":"Tipo","value":"AIO Líquida"},{"label":"Radiador","value":"120mm"},{"label":"Ventiladores","value":"1x 120mm ARGB"},{"label":"TDP","value":"200W"},{"label":"Compatible","value":"Intel LGA1700, AMD AM5/AM4"}]'::jsonb, 4),
    
    (cat_refrigeracion, 'Cooler Master MasterLiquid 240L Core ARGB', 320000, 5, 'REFRIGERACIÓN LÍQUIDA', '/images/productos/cooler-ml240l.webp',
     '[{"label":"Tipo","value":"AIO Líquida"},{"label":"Radiador","value":"240mm"},{"label":"Ventiladores","value":"2x 120mm ARGB"},{"label":"TDP","value":"280W"},{"label":"Compatible","value":"Intel LGA1700, AMD AM5/AM4"}]'::jsonb, 5);

    -- =====================================================
    -- FUENTES DE PODER
    -- =====================================================
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, imagen_url, especificaciones, orden)
    VALUES 
    (cat_fuentes, 'EVGA 700 BR 80+ Bronze', 220000, 8, '600-750W', '/images/productos/psu-evga-700.webp',
     '[{"label":"Potencia","value":"700W"},{"label":"Certificación","value":"80+ Bronze"},{"label":"Modular","value":"No"},{"label":"Ventilador","value":"120mm"}]'::jsonb, 1),
    
    (cat_fuentes, 'MSI MAG A750GL 80+ Gold', 350000, 5, '600-750W', '/images/productos/psu-msi-750.webp',
     '[{"label":"Potencia","value":"750W"},{"label":"Certificación","value":"80+ Gold"},{"label":"Modular","value":"Full Modular"},{"label":"ATX 3.0","value":"Sí"},{"label":"Conector","value":"12VHPWR incluido"}]'::jsonb, 2),
    
    (cat_fuentes, 'CORSAIR RM850x 80+ Gold', 480000, 4, '800-1000W', '/images/productos/psu-corsair-850.webp',
     '[{"label":"Potencia","value":"850W"},{"label":"Certificación","value":"80+ Gold"},{"label":"Modular","value":"Full Modular"},{"label":"Zero RPM","value":"Sí"},{"label":"Ventilador","value":"135mm"}]'::jsonb, 3);

END $$;

-- =====================================================
-- VERIFICAR MIGRACIÓN
-- =====================================================
SELECT 
    c.nombre as categoria,
    COUNT(p.id) as total_productos
FROM categorias c
LEFT JOIN productos p ON c.id = p.categoria_id
GROUP BY c.nombre, c.orden
ORDER BY c.orden;
