import { getProfessores } from '../api/professor.api.js';
import { getCidadePorId } from '../api/cidade.api.js';
import { renderTabelaProfessores } from '../ui/professor.ui.js';

export async function executarPesquisaProfessores() {
  try {
    const container = document.getElementById('resultados-tabela-professores');
    // Ler os filtros da tela
    const cpf = document.getElementById('cpf')?.value || '';
    const nome = document.getElementById('nome')?.value || '';
    const ufId = document.getElementById('uf')?.value || '';
    const cidadeId = document.getElementById('cidade')?.value || '';
    const nomeCurso = document.getElementById('nomeCurso')?.value || '';

    const filtros = { cpf, nome, ufId, cidadeId, nomeCurso };
    console.log('Filtros usados na pesquisa de professores:', filtros);
    const professores = await getProfessores(filtros);
    console.log('Professores retornados:', professores);

    
    if (container) {
      renderTabelaProfessores(container, professores);
    }

    // cache simples em memória (opcional)
    window.professoresPesquisaResultados = professores;
   return professores;
   
  } catch (err) {
    console.error('Erro na pesquisa de professores:', err);
    const container = document.getElementById('resultados-tabela-professores');
    if (container) {
      // em caso de erro, renderiza vazio
      renderTabelaProfessores(container, []);
    }
    return [];
  }
}

export async function getProfessorPorId(id) {
  const lista = await getProfessores({ id });
  return lista[0] || null;
}
