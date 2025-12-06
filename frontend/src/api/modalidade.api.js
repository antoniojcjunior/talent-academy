// src/api/cidade.api.js
import { API_BASE } from '../config.js';

// Busca uma única Modalidade pelo ID
export async function getModalidadePorId(id) {
  try {
    const resp = await fetch(`${API_BASE}/api/modalidade/${id}`);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar modalidade ${id}: ${resp.status}`);
    }
     const data = await resp.json();

    // Se vier array, devolve o primeiro item.
    if (Array.isArray(data)) {
        return data[0] || null;
    }

    // Se já vier objeto único, retorna como está.
    return data;
    
    } catch (err) {
        console.error('Falha em getModalidadePorId:', err);
        return null; // fallback seguro
    }
}

// Busca modalidades
export async function getModalidades() {
  try {
    const resp = await fetch(`${API_BASE}/api/modalidades`);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar modalidades: ${resp.status}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('Falha em getModalidades:', err);
    return []; // fallback seguro
  }
}
