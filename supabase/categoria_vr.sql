-- Crear categoría Realidad Virtual con subcategorías

DO $$
DECLARE
    v_categoria_id UUID;
BEGIN
    -- Crear la categoría Realidad Virtual
    INSERT INTO categorias (nombre, icono, orden)
    VALUES ('Realidad Virtual', '🥽', 11)
    RETURNING id INTO v_categoria_id;
    
    -- Insertar subcategorías
    INSERT INTO subcategorias (nombre, categoria_id, orden)
    VALUES 
        ('META QUEST', v_categoria_id, 1),
        ('VR ACCESORIOS', v_categoria_id, 2);
    
    RAISE NOTICE 'Categoría Realidad Virtual creada con ID: %', v_categoria_id;
END $$;

-- Verificar
SELECT c.icono, c.nombre as categoria, s.nombre as subcategoria
FROM categorias c
LEFT JOIN subcategorias s ON s.categoria_id = c.id
WHERE c.nombre = 'Realidad Virtual'
ORDER BY s.orden;
