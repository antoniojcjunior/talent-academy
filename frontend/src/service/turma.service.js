import { getTurmas } from '../api/turma.api.js';
import { renderTabelaTurmas } from '../ui/turma.ui.js';
import { deleteTurma } from '../api/turma.api.js';
import { showConfirm, showAlert } from '../utils/show-alert.util.js'; 

export async function executarPesquisaTurmas() {
  try {
    const container = document.getElementById('resultados-tabela-turmas');

    // Ler os filtros da tela (IDs usados conforme padrão das páginas)
    const cursoId = document.getElementById('curso')?.value || '';
    const ufId = document.getElementById('uf')?.value || '';
    const cidadeId = document.getElementById('cidade')?.value || '';
    const professorId = document.getElementById('professor')?.value || '';
    const status = document.getElementById('status_turma')?.value || '';
    const dataInicio = document.getElementById('dataInicio')?.value || '';
    const dataFim = document.getElementById('dataFim')?.value || '';
    //Captura dos valores do Tom Select -->>
    const statusSelect = document.getElementById('status-turma-multi');
    // Coleta todos os valores selecionados. Retorna um Array de strings.
    const statusSelecionados = statusSelect.tomselect.items.slice();

    const filtros = { cursoId, ufId, cidadeId, professorId, statusId: statusSelecionados, dataInicio, dataFim };
    console.log('Filtros usados na pesquisa de turmas:', filtros);

    const turmas = await getTurmas(filtros);
    console.log('Turmas retornadas:', turmas);

    if (container) { 
      renderTabelaTurmas(container, turmas);
    }
    // armazenamento simples para consumo posterior
    window.turmasPesquisaResultados = turmas;

    return turmas;
    
  } catch (err) {
    console.error('Erro na pesquisa de turmas:', err);
    const container = document.getElementById('resultados-tabela-turmas');
    if (container) {
      try {
        renderTabelaTurmas(container, []);
      } catch (e) {
        // silencioso: não forçar mais lógicas de fallback
      }
    }
    return [];
  }
}

export async function excluirTurma(id, nomeTurma) {
  if (!id) {
    console.error('excluirTurma chamada sem ID');
    await showAlert('Não foi possível identificar a turma para exclusão.');
    return false;
  }

  // 1) Confirmação com o usuário
  const confirmou = await showConfirm(
    `Deseja realmente excluir a turma "${nomeTurma}"?`
  );

  if (!confirmou) {
    // usuário cancelou
    return false;
  }

  try {
    // 2) Chama a API
    await deleteTurma(id);

    // 3) Feedback de sucesso
    await showAlert(`Turma "${nomeTurma}" excluída com sucesso.`);
    return true;
  } catch (err) {
    console.error('Erro ao excluir turma:', err);
    const msg = err?.message || 'Erro ao excluir turma.';
    await showAlert(msg);
    return false;
  }
}