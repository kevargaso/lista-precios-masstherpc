-- Crear categoría Periféricos con todas sus subcategorías

DO $$
DECLARE
    v_categoria_id UUID;
BEGIN
    -- Crear la categoría Periféricos
    INSERT INTO categorias (nombre, icono, orden)
    VALUES ('Periféricos', '🖱️', 10)
    RETURNING id INTO v_categoria_id;
    
    -- Insertar subcategorías
    INSERT INTO subcategorias (nombre, categoria_id, orden)
    VALUES 
        ('MOUSE', v_categoria_id, 1),
        ('TECLADOS', v_categoria_id, 2),
        ('MONITORES', v_categoria_id, 3),
        ('AUDÍFONOS', v_categoria_id, 4),
        ('WEBCAMS', v_categoria_id, 5),
        ('MOUSEPADS', v_categoria_id, 6),
        ('HEADSETS', v_categoria_id, 7),
        ('MICRÓFONOS', v_categoria_id, 8),
        ('CONTROLLERS', v_categoria_id, 9),
        ('PARLANTES', v_categoria_id, 10);
    
    RAISE NOTICE 'Categoría Periféricos creada con ID: %', v_categoria_id;
END $$;

-- Verificar
SELECT c.icono, c.nombre as categoria, s.nombre as subcategoria, s.orden
FROM categorias c
LEFT JOIN subcategorias s ON s.categoria_id = c.id
WHERE c.nombre = 'Periféricos'
ORDER BY s.orden;
