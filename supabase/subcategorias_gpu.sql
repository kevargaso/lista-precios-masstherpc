-- Agregar subcategorías para Tarjetas Gráficas

DO $$
DECLARE
    v_categoria_id UUID;
BEGIN
    -- Obtener ID de la categoría Tarjetas Gráficas
    SELECT id INTO v_categoria_id FROM categorias WHERE nombre = 'Tarjetas Gráficas' OR nombre = 'Tarjetas Graficas' LIMIT 1;
    
    IF v_categoria_id IS NOT NULL THEN
        -- Insertar subcategorías
        INSERT INTO subcategorias (nombre, categoria_id, orden)
        VALUES 
            ('AMD RADEON', v_categoria_id, 1),
            ('NVIDIA GEFORCE', v_categoria_id, 2),
            ('INTEL ARC', v_categoria_id, 3);
        
        RAISE NOTICE 'Subcategorías agregadas exitosamente para Tarjetas Gráficas (ID: %)', v_categoria_id;
    ELSE
        RAISE NOTICE 'No se encontró la categoría Tarjetas Gráficas';
    END IF;
END $$;

-- Verificar las subcategorías creadas
SELECT s.nombre as subcategoria, c.nombre as categoria 
FROM subcategorias s 
JOIN categorias c ON s.categoria_id = c.id 
WHERE c.nombre LIKE '%Tarjetas%'
ORDER BY s.orden;
