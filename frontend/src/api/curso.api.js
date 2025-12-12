import { API_BASE } from '../config.js';

// Buscar cursos com parâmetros opcionais
export async function getCursos({ nomeCurso, modalidadeId, professorId } = {}) {
  const params = new URLSearchParams();

  // Só adiciona parâmetros se estiverem preenchidos
  if (nomeCurso) params.append('nomeCurso', nomeCurso);
  if (modalidadeId) params.append('modalidadeId', modalidadeId);
  if (professorId) params.append('professorId', professorId);
  
  // Monta a URL com querystring (se houver)
  const urlBase = `${API_BASE}/api/cursos`;
  const url = params.toString() ? `${urlBase}?${params.toString()}` : urlBase;


  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar cursos: ${resp.status}`);
    }
    return await resp.json();
  } catch (err) {
    console.error('Falha em getCursos():', err);
    throw new Error('Não foi possível obter a lista de cursos.');
  }
}
