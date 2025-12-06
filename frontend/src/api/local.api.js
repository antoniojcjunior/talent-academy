import { API_BASE } from '../config.js';

// Buscar locais com parâmetros opcionais
export async function getLocais({ id, nome, ufId, cidadeId, bairro } = {}) {
  const params = new URLSearchParams();

  // Só adiciona parâmetros se estiverem preenchidos
  if (id) params.append('id', id);
  if (nome) params.append('nome', nome);
  if (ufId) params.append('ufId', ufId);
  if (cidadeId) params.append('cidadeId', cidadeId);
  if (bairro) params.append('bairro', bairro);

  // Monta a URL com querystring (se houver)
  const urlBase = `${API_BASE}/api/locais`;
  const url = params.toString() ? `${urlBase}?${params.toString()}` : urlBase;

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(`Erro ao buscar locais: ${resp.status}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('Falha em fetchLocais():', err);
    throw new Error('Não foi possível consultar os locais com filtros.');
  }
}

export async function deleteLocal(id) {
  if (!id) {
    throw new Error('ID do local é obrigatório para exclusão.');
  }

  const resp = await fetch(`${API_BASE}/api/locais/${id}`, {
    method: 'DELETE',
  });

  if (!resp.ok) {
    let msg = 'Erro ao excluir local.';
    try {
      const erro = await resp.json();
      if (erro?.error) msg = erro.error;
    } catch {
    }
    throw new Error(msg);
  }

  return true;
}

