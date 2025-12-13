import { API_BASE } from '../config.js';

// Buscar TODOS os professores
export async function getProfessores({ id, cpf, nome, ufId, cidadeId, nomeCurso, status } = {}) {
  const params = new URLSearchParams();

  // Só adiciona parâmetros se estiverem preenchidos
  if (id) params.append('id', id);
  if (cpf) params.append('cpf', cpf);
  if (nome) params.append('nome', nome);
  if (ufId) params.append('ufId', ufId);
  if (cidadeId) params.append('cidadeId', cidadeId);
  if (nomeCurso) params.append('nomeCurso', nomeCurso);
  if (status) params.append('status', status);
  
  // Monta a URL com querystring (se houver)
  const urlBase = `${API_BASE}/api/professores`;
  const url = params.toString() ? `${urlBase}?${params.toString()}` : urlBase;


  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar professores: ${resp.status}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('Falha em getProfessores():', err);
    throw new Error('Não foi possível obter a lista de professores.');
  }
}

export async function getProfessorDetalhado(id) {
  if (!id) {
    throw new Error('ID do professor não informado.');
  }

  const url = `${API_BASE}/api/professores/${encodeURIComponent(id)}`;

  try {
    const resp = await fetch(url);

    if (resp.status === 404) {
      throw new Error('Professor não encontrado.');
    }

    if (!resp.ok) {
      throw new Error(`Erro ao detalhar professor: ${resp.status}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('Falha em getProfessorDetalhado():', err);
    throw err;
  }
}