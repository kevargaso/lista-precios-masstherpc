-- Schema para Combos de Productos

-- Tabla principal de combos
CREATE TABLE combos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    imagen_url TEXT,
    precio_total DECIMAL(12,2) DEFAULT 0,
    descuento_total DECIMAL(12,2) DEFAULT 0,
    precio_final DECIMAL(12,2) DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items del combo (1 producto por categoría)
CREATE TABLE combo_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combo_id UUID REFERENCES combos(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
    categoria_id UUID REFERENCES categorias(id),
    precio_original DECIMAL(12,2) NOT NULL,
    descuento DECIMAL(12,2) DEFAULT 0,
    precio_final DECIMAL(12,2) NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Garantizar 1 producto por categoría por combo
    UNIQUE(combo_id, categoria_id)
);

-- Índices
CREATE INDEX idx_combo_items_combo ON combo_items(combo_id);
CREATE INDEX idx_combos_activo ON combos(activo);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_combos_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER combos_updated_at
    BEFORE UPDATE ON combos
    FOR EACH ROW
    EXECUTE FUNCTION update_combos_timestamp();

-- RLS Policies
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_items ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública
CREATE POLICY "Combos activos visibles públicamente"
    ON combos FOR SELECT
    USING (activo = true);

CREATE POLICY "Items de combo públicos"
    ON combo_items FOR SELECT
    USING (true);

-- Políticas para usuarios autenticados (admin)
CREATE POLICY "Admin puede gestionar combos"
    ON combos FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar combo items"
    ON combo_items FOR ALL
    USING (auth.role() = 'authenticated');
