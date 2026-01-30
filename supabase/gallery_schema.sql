-- =====================================================
-- SISTEMA DE GALERÍA DE IMÁGENES
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Tabla para galería de imágenes por producto
CREATE TABLE IF NOT EXISTS producto_imagenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultas eficientes
CREATE INDEX IF NOT EXISTS idx_producto_imagenes_producto ON producto_imagenes(producto_id);

-- Asegurar que solo haya UNA imagen principal por producto
CREATE OR REPLACE FUNCTION check_single_principal_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.es_principal = TRUE THEN
        UPDATE producto_imagenes 
        SET es_principal = FALSE 
        WHERE producto_id = NEW.producto_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_principal ON producto_imagenes;
CREATE TRIGGER ensure_single_principal
    AFTER INSERT OR UPDATE ON producto_imagenes
    FOR EACH ROW
    EXECUTE FUNCTION check_single_principal_image();

-- RLS para imágenes
ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Imagenes visibles para todos" ON producto_imagenes
    FOR SELECT USING (true);

-- Admin puede modificar
CREATE POLICY "Admin puede gestionar imagenes" ON producto_imagenes
    FOR ALL TO authenticated
    USING (true);

-- =====================================================
-- CONFIGURAR STORAGE BUCKET
-- =====================================================
-- NOTA: Esto debe hacerse manualmente en Supabase Dashboard:
-- 1. Ir a Storage
-- 2. Click "New bucket"
-- 3. Nombre: "productos"
-- 4. Marcar "Public bucket"
-- 5. Click "Create bucket"
-- 6. En el bucket, ir a Policies y agregar:
--    - Policy name: "Allow public read"
--    - Operation: SELECT
--    - Target roles: (vacío = todos)
--    - Policy: true
--
--    - Policy name: "Allow authenticated upload"
--    - Operation: INSERT
--    - Target roles: authenticated
--    - Policy: true
--
--    - Policy name: "Allow authenticated delete"
--    - Operation: DELETE
--    - Target roles: authenticated
--    - Policy: true

-- =====================================================
-- VERIFICAR INSTALACIÓN
-- =====================================================
SELECT 'producto_imagenes table created' as status
WHERE EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'producto_imagenes'
);
