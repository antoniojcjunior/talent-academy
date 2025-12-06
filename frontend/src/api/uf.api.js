import { API_BASE } from '../config.js';

// Busca uma única uf pelo ID
export async function getUfPorId(id) {
  try {
    const resp = await fetch(`${API_BASE}/api/uf/${id}`);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar uf ${id}: ${resp.status}`);
    }
     const data = await resp.json();

    // Se vier array, devolve o primeiro item.
    if (Array.isArray(data)) {
        return data[0] || null;
    }

    // Se já vier objeto único, retorna como está.
    return data;
    
    } catch (err) {
        console.error('Falha em getUfPorId:', err);
        return null; // fallback seguro
    }
}