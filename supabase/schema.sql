-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA LISTA DE PRECIOS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: CATEGORÍAS
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    icono TEXT DEFAULT '📦',
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar categorías iniciales
INSERT INTO categorias (nombre, icono, orden) VALUES
    ('Combos', '🔥', 1),
    ('Procesadores', '⚡', 2),
    ('Motherboards', '🖥️', 3),
    ('Memoria RAM', '👀', 4),
    ('Almacenamiento', '💾', 5),
    ('Tarjetas Gráficas', '🎮', 6),
    ('Refrigeración', '❄️', 7),
    ('Fuentes de Poder', '🔌', 8);

-- =====================================================
-- TABLA: PRODUCTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(12,2) NOT NULL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    imagen_url TEXT,
    especificaciones JSONB DEFAULT '[]'::jsonb,
    es_combo BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    etiqueta TEXT, -- "BLISTER", "BLANCA", "NEGRO", etc.
    subcategoria TEXT, -- "AMD RYZEN", "DDR4", "REFRIGERACIÓN LÍQUIDA", etc.
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: PRODUCTOS EN COMBOS
-- =====================================================
CREATE TABLE IF NOT EXISTS combo_productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    combo_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    producto_nombre TEXT NOT NULL,
    producto_descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_orden ON productos(orden);
CREATE INDEX IF NOT EXISTS idx_combo_productos_combo ON combo_productos(combo_id);

-- =====================================================
-- TRIGGER PARA ACTUALIZAR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
CREATE TRIGGER update_productos_updated_at
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_productos ENABLE ROW LEVEL SECURITY;

-- Políticas para LECTURA pública (cualquiera puede ver productos activos)
CREATE POLICY "Categorias visibles para todos" ON categorias
    FOR SELECT USING (true);

CREATE POLICY "Productos activos visibles para todos" ON productos
    FOR SELECT USING (activo = true);

CREATE POLICY "Combo productos visibles para todos" ON combo_productos
    FOR SELECT USING (true);

-- Políticas para ADMIN (solo usuarios autenticados pueden modificar)
CREATE POLICY "Admin puede ver todos los productos" ON productos
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admin puede insertar productos" ON productos
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admin puede actualizar productos" ON productos
    FOR UPDATE TO authenticated
    USING (true);

CREATE POLICY "Admin puede eliminar productos" ON productos
    FOR DELETE TO authenticated
    USING (true);

-- Políticas para categorías (admin)
CREATE POLICY "Admin puede modificar categorias" ON categorias
    FOR ALL TO authenticated
    USING (true);

-- Políticas para combo_productos (admin)
CREATE POLICY "Admin puede modificar combo_productos" ON combo_productos
    FOR ALL TO authenticated
    USING (true);

-- =====================================================
-- STORAGE BUCKET PARA IMÁGENES
-- (Ejecutar en la sección Storage de Supabase)
-- =====================================================
-- 1. Crear bucket "productos" 
-- 2. Hacerlo público para lectura
-- 3. Configurar política: authenticated puede upload/delete

-- =====================================================
-- DATOS DE EJEMPLO (opcional)
-- =====================================================

-- Obtener IDs de categorías
DO $$
DECLARE
    cat_combos UUID;
    cat_procesadores UUID;
    cat_motherboards UUID;
    cat_ram UUID;
BEGIN
    SELECT id INTO cat_combos FROM categorias WHERE nombre = 'Combos';
    SELECT id INTO cat_procesadores FROM categorias WHERE nombre = 'Procesadores';
    SELECT id INTO cat_motherboards FROM categorias WHERE nombre = 'Motherboards';
    SELECT id INTO cat_ram FROM categorias WHERE nombre = 'Memoria RAM';

    -- Insertar algunos productos de ejemplo
    INSERT INTO productos (categoria_id, nombre, precio, stock, subcategoria, especificaciones, es_combo, orden)
    VALUES 
        (cat_procesadores, 'AMD Ryzen 5 9600X', 840000, 5, 'AMD RYZEN', 
         '[{"label": "Núcleos/Hilos", "value": "6 núcleos / 12 hilos"}, {"label": "Frecuencia Base", "value": "3.9 GHz"}, {"label": "Frecuencia Turbo", "value": "hasta 5.4 GHz"}, {"label": "TDP", "value": "65W"}, {"label": "Arquitectura", "value": "Zen 5"}]'::jsonb, 
         false, 1),
        
        (cat_motherboards, 'ASUS PRIME B550M-A WiFi II', 360000, 8, 'AMD - Socket AM4',
         '[{"label": "Formato", "value": "Micro-ATX"}, {"label": "Memoria", "value": "DDR4, 4 slots, hasta 128GB"}, {"label": "Chipset", "value": "AMD B550"}]'::jsonb,
         false, 1),
        
        (cat_ram, 'CORSAIR Vengeance LPX 16GB (2 x 8GB) DDR4', 180000, 10, 'DDR4',
         '[{"label": "Latencia", "value": "CL16"}, {"label": "Velocidad", "value": "3200 MHz"}, {"label": "Tipo", "value": "288-Pin PC RAM"}]'::jsonb,
         false, 1);
END $$;

-- =====================================================
-- ¡LISTO! Tu base de datos está configurada
-- =====================================================
