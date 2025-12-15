import { getLocais, deleteLocal } from '../api/local.api.js';
import { getCidadePorId } from '../api/cidade.api.js';
import { getUfPorId } from '../api/uf.api.js';
import { renderTabelaLocais } from '../ui/local.ui.js';
import { showConfirm, showAlert } from '../utils/show-alert.util.js'; 

export async function executarPesquisaLocais() {
  try {
    const container = document.getElementById('resultados-tabela-locais');
    // Ler os filtros da tela
    const ufId = document.getElementById('uf')?.value || undefined;
    const cidadeId = document.getElementById('cidade')?.value || undefined;
    const nome = document.getElementById('nomeLocal')?.value || '';
    const bairro = document.getElementById('bairro')?.value || '';

    const filtros = {
      ...(ufId && { ufId }),
      ...(cidadeId && { cidadeId }),
      ...(nome && { nome }),
      ...(bairro && { bairro })
    };  
    console.log('Filtros usados na pesquisa de locais:', filtros);

    // Chamar a API com TODOS os filtros (a API ignora vazios)
    const locais = await getLocais(filtros);
    console.log('Locais retornados da API:', locais);

    if (container) {
      renderTabelaLocais(container, locais);
    }

    // cache simples em memória (opcional)
    window.locaisPesquisaResultados = locais;

   return locais;
   
  } catch (err) {
    console.error('Erro na pesquisa de locais:', err);
    const container = document.getElementById('resultados-tabela');
    if (container) {
      // em caso de erro, renderiza vazio
      renderTabelaLocais(container, []);
    }
    return [];
  }
}

export async function excluirLocal(id, nomeLocal) {
  if (!id) {
    console.error('excluirLocal chamada sem ID');
    await showAlert('Não foi possível identificar o local para exclusão.');
    return false;
  }

  // 1) Confirmação com o usuário
  const confirmou = await showConfirm(
    `Deseja realmente excluir o local "${nomeLocal}"?`
  );

  if (!confirmou) {
    // usuário cancelou
    return false;
  }

  try {
    // 2) Chama a API
    await deleteLocal(id);

    // 3) Feedback de sucesso
    await showAlert(`Local "${nomeLocal}" excluído com sucesso.`);
    return true;
  } catch (err) {
    console.error('Erro ao excluir local:', err);
    const msg = err?.message || 'Erro ao excluir local.';
    await showAlert(msg);
    return false;
  }
}

export async function getLocalPorId(id) {
  const lista = await getLocais({ id });
  return lista[0] || null;
}