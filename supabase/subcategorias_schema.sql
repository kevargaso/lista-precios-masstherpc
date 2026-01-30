-- =====================================================
-- TABLA DE SUBCATEGORÍAS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS subcategorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_subcategorias_categoria ON subcategorias(categoria_id);

-- RLS
ALTER TABLE subcategorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subcategorias visibles para todos" ON subcategorias
    FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar subcategorias" ON subcategorias
    FOR ALL TO authenticated USING (true);

-- =====================================================
-- INSERTAR SUBCATEGORÍAS INICIALES
-- =====================================================

DO $$
DECLARE
    cat_procesadores UUID;
    cat_motherboards UUID;
    cat_ram UUID;
    cat_almacenamiento UUID;
    cat_refrigeracion UUID;
    cat_fuentes UUID;
BEGIN
    SELECT id INTO cat_procesadores FROM categorias WHERE nombre = 'Procesadores';
    SELECT id INTO cat_motherboards FROM categorias WHERE nombre = 'Motherboards';
    SELECT id INTO cat_ram FROM categorias WHERE nombre = 'Memoria RAM';
    SELECT id INTO cat_almacenamiento FROM categorias WHERE nombre = 'Almacenamiento';
    SELECT id INTO cat_refrigeracion FROM categorias WHERE nombre = 'Refrigeración';
    SELECT id INTO cat_fuentes FROM categorias WHERE nombre = 'Fuentes de Poder';

    -- Subcategorías de Procesadores
    INSERT INTO subcategorias (categoria_id, nombre, orden) VALUES
    (cat_procesadores, 'AMD RYZEN', 1),
    (cat_procesadores, 'INTEL', 2);

    -- Subcategorías de Motherboards
    INSERT INTO subcategorias (categoria_id, nombre, orden) VALUES
    (cat_motherboards, 'AMD - Socket AM4', 1),
    (cat_motherboards, 'AMD - Socket AM5', 2),
    (cat_motherboards, 'INTEL - Socket LGA1700', 3),
    (cat_motherboards, 'INTEL - Socket LGA1851', 4);

    -- Subcategorías de RAM
    INSERT INTO subcategorias (categoria_id, nombre, orden) VALUES
    (cat_ram, 'DDR4', 1),
    (cat_ram, 'DDR5', 2);

    -- Subcategorías de Almacenamiento
    INSERT INTO subcategorias (categoria_id, nombre, orden) VALUES
    (cat_almacenamiento, 'SSD NVMe', 1),
    (cat_almacenamiento, 'SSD SATA', 2),
    (cat_almacenamiento, 'HDD', 3);

    -- Subcategorías de Refrigeración
    INSERT INTO subcategorias (categoria_id, nombre, orden) VALUES
    (cat_refrigeracion, 'REFRIGERACIÓN POR AIRE', 1),
    (cat_refrigeracion, 'REFRIGERACIÓN LÍQUIDA', 2);

    -- Subcategorías de Fuentes
    INSERT INTO subcategorias (categoria_id, nombre, orden) VALUES
    (cat_fuentes, '400-550W', 1),
    (cat_fuentes, '600-750W', 2),
    (cat_fuentes, '800-1000W', 3),
    (cat_fuentes, '1000W+', 4);

END $$;

-- Verificar
SELECT c.nombre as categoria, s.nombre as subcategoria
FROM subcategorias s
JOIN categorias c ON s.categoria_id = c.id
ORDER BY c.orden, s.orden;
