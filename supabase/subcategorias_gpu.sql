-- Agregar subcategorías para Tarjetas Gráficas
-- Primero obtenemos el ID de la categoría "Tarjetas Gráficas"

DO $$
DECLARE
    categoria_id UUID;
BEGIN
    -- Obtener ID de la categoría Tarjetas Gráficas
    SELECT id INTO categoria_id FROM categorias WHERE nombre = 'Tarjetas Gráficas' OR nombre = 'Tarjetas Graficas' LIMIT 1;
    
    IF categoria_id IS NOT NULL THEN
        -- Insertar subcategorías si no existen
        INSERT INTO subcategorias (nombre, categoria_id, orden)
        VALUES 
            ('AMD RADEON', categoria_id, 1),
            ('NVIDIA GEFORCE', categoria_id, 2),
            ('INTEL ARC', categoria_id, 3)
        ON CONFLICT (nombre, categoria_id) DO NOTHING;
        
        RAISE NOTICE 'Subcategorías agregadas exitosamente para Tarjetas Gráficas (ID: %)', categoria_id;
    ELSE
        RAISE NOTICE 'No se encontró la categoría Tarjetas Gráficas';
    END IF;
END $$;

-- Verificar las subcategorías creadas
SELECT s.nombre as subcategoria, c.nombre as categoria 
FROM subcategorias s 
JOIN categorias c ON s.categoria_id = c.id 
WHERE c.nombre LIKE '%Tarjetas%' OR c.nombre LIKE '%Gr_ficas%'
ORDER BY s.orden;
