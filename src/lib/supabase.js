import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase no configurado. Usando modo demo.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper para verificar conexión
export const isSupabaseConfigured = () => !!supabase;

// Funciones de productos
export const productosApi = {
    // Obtener todos los productos activos
    async getAll() {
        if (!supabase) return { data: [], error: null };

        const { data, error } = await supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias(id, nombre, icono)
            `)
            .eq('activo', true)
            .order('orden', { ascending: true });

        return { data, error };
    },

    // Obtener producto por ID
    async getById(id) {
        if (!supabase) return { data: null, error: null };

        const { data, error } = await supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias(id, nombre, icono)
            `)
            .eq('id', id)
            .single();

        return { data, error };
    },

    // Crear producto (solo admin)
    async create(producto) {
        if (!supabase) return { data: null, error: 'No configurado' };

        const { data, error } = await supabase
            .from('productos')
            .insert([producto])
            .select()
            .single();

        return { data, error };
    },

    // Actualizar producto (solo admin)
    async update(id, updates) {
        if (!supabase) return { data: null, error: 'No configurado' };

        const { data, error } = await supabase
            .from('productos')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        return { data, error };
    },

    // Actualizar solo stock
    async updateStock(id, nuevoStock) {
        return this.update(id, { stock: nuevoStock });
    },

    // Eliminar producto (soft delete)
    async delete(id) {
        return this.update(id, { activo: false });
    },

    // Obtener productos para admin (incluye inactivos)
    async getAllAdmin() {
        if (!supabase) return { data: [], error: null };

        const { data, error } = await supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias(id, nombre, icono)
            `)
            .order('categoria_id', { ascending: true })
            .order('orden', { ascending: true });

        return { data, error };
    }
};

// Funciones de categorías
export const categoriasApi = {
    async getAll() {
        if (!supabase) return { data: [], error: null };

        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .order('orden', { ascending: true });

        return { data, error };
    },

    async create(categoria) {
        if (!supabase) return { data: null, error: 'No configurado' };

        const { data, error } = await supabase
            .from('categorias')
            .insert([categoria])
            .select()
            .single();

        return { data, error };
    },

    async update(id, updates) {
        if (!supabase) return { data: null, error: 'No configurado' };

        const { data, error } = await supabase
            .from('categorias')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        return { data, error };
    },

    async delete(id) {
        if (!supabase) return { data: null, error: 'No configurado' };

        const { data, error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id);

        return { data, error };
    }
};

// Funciones de storage para imágenes
export const storageApi = {
    async uploadImage(file, path) {
        if (!supabase) return { data: null, error: 'No configurado' };

        const fileExt = file.name.split('.').pop();
        const fileName = `${path}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('productos')
            .upload(fileName, file);

        if (error) return { data: null, error };

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from('productos')
            .getPublicUrl(fileName);

        return { data: urlData.publicUrl, error: null };
    },

    async deleteImage(url) {
        if (!supabase) return { error: 'No configurado' };

        // Extraer nombre del archivo de la URL
        const fileName = url.split('/').pop();

        const { error } = await supabase.storage
            .from('productos')
            .remove([fileName]);

        return { error };
    }
};

// Funciones de autenticación
export const authApi = {
    async signIn(email, password) {
        if (!supabase) return { data: null, error: 'No configurado' };

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        return { data, error };
    },

    async signOut() {
        if (!supabase) return { error: null };

        const { error } = await supabase.auth.signOut();
        return { error };
    },

    async getSession() {
        if (!supabase) return { data: null, error: null };

        const { data, error } = await supabase.auth.getSession();
        return { data: data?.session, error };
    },

    onAuthStateChange(callback) {
        if (!supabase) return { data: { subscription: { unsubscribe: () => { } } } };

        return supabase.auth.onAuthStateChange(callback);
    }
};
