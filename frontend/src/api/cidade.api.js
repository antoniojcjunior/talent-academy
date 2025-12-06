import { API_BASE } from '../config.js';

// Busca uma única cidade pelo ID
export async function getCidadePorId(id) {
  try {
    const resp = await fetch(`${API_BASE}/api/cidade/${id}`);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar cidade ${id}: ${resp.status}`);
    }
     const data = await resp.json();

    // Se vier array, devolve o primeiro item.
    if (Array.isArray(data)) {
        return data[0] || null;
    }

    // Se já vier objeto único, retorna como está.
    return data;
    
    } catch (err) {
        console.error('Falha em getCidadePorId:', err);
        return null; // fallback seguro
    }
}

// Busca cidades de uma UF específica, se o backend tiver essa rota
export async function getCidadesPorUF(ufId) {
  try {
    const resp = await fetch(`${API_BASE}/api/cidades/${ufId}`);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar cidades da UF ${ufId}: ${resp.status}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('Falha em getCidadesPorUF:', err);
    return []; // fallback seguro
  }
}
