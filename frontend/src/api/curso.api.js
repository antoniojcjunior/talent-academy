import { API_BASE } from '../config.js';

// Buscar cursos com parâmetros opcionais
export async function getCursos({ id, nomeCurso, modalidadeId, professorId } = {}) {
  const params = new URLSearchParams();

  // Só adiciona parâmetros se estiverem preenchidos
  if (id) params.append('id', id);
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

// Retorna: { curso: {...}, professores: [...] }
export async function getCursoDetalhado(id) {
  if (!id) {
    throw new Error('ID do curso não informado.');
  }

  const url = `${API_BASE}/api/cursos/${encodeURIComponent(id)}`;

  try {
    const resp = await fetch(url);

    if (resp.status === 404) {
      throw new Error('Curso não encontrado.');
    }

    if (!resp.ok) {
      throw new Error(`Erro ao detalhar curso: ${resp.status}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('Falha em getCursoDetalhado():', err);
    // mantém a mensagem específica se já for “Curso não encontrado.”
    throw err instanceof Error ? err : new Error('Não foi possível obter o detalhamento do curso.');
  }
}