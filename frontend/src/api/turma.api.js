import { API_BASE } from '../config.js';

// Buscar turmas com parâmetros opcionais
export async function getTurmas({
  cursoId,
  ufId,
  cidadeId,
  professorId,
  statusId,
  dataInicio,
  dataFim
} = {}) {
  const params = new URLSearchParams();

  // Adiciona apenas parâmetros preenchidos
  if (cursoId) params.append('cursoId', cursoId);
  if (ufId) params.append('ufId', ufId);
  if (cidadeId) params.append('cidadeId', cidadeId);
  if (professorId) params.append('professorId', professorId);
  if (dataInicio) params.append('dataInicio', dataInicio);
  if (dataFim) params.append('dataFim', dataFim);
  // STATUS MULTIPLO (Tom Select)
  if (Array.isArray(statusId)) {
    statusId.forEach(s => {
      if (s) params.append('statusId', s);
    });
  } else if (statusId) {
    // Caso raro: status vindo como string simples
    params.append('statusId', statusId);
  }
  console.log('Status IDs para filtro de turmas:', statusId);
  const urlBase = `${API_BASE}/api/turmas`;
  const url = params.toString() ? `${urlBase}?${params.toString()}` : urlBase;

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar turmas: ${resp.status}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('Falha em getTurmas():', err);
    throw new Error('Não foi possível obter a lista de turmas.');
  }
}

// Buscar turma por ID (detalhamento)
export async function getTurmaPorId(id) {
  if (!id) {
    throw new Error('ID da turma não informado.');
  }

  const url = `${API_BASE}/api/turmas/${encodeURIComponent(id)}`;

  try {
    const resp = await fetch(url);

    if (resp.status === 404) {
      throw new Error('Turma não encontrada.');
    }

    if (!resp.ok) {
      throw new Error(`Erro ao buscar turma: ${resp.status}`);
    }

    return await resp.json(); // vem um objeto (rows[0])
  } catch (err) {
    console.error('Falha em getTurmaPorId():', err);
    throw err;
  }
}


export async function deleteTurma(id) {
  if (!id) {
    throw new Error('ID da turma é obrigatório para exclusão.');
  }

  const resp = await fetch(`${API_BASE}/api/turmas/${id}`, {
    method: 'DELETE',
  });

  if (!resp.ok) {
    let msg = 'Erro ao excluir turma.';
    try {
      const erro = await resp.json();
      if (erro?.error) msg = erro.error;
    } catch {
      // se a resposta não for JSON, mantém a mensagem padrão
    }
    throw new Error(msg);
  }
  return true;
}