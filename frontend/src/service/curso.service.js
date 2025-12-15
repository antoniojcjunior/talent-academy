import { getCursos, getCursoDetalhado } from '../api/curso.api.js';
import { renderTabelaCursos } from '../ui/curso.ui.js';

export async function executarPesquisaCursos() {
  try {
    const container = document.getElementById('resultados-tabela-cursos');
    // Ler os filtros da tela
    const nomeCurso = document.getElementById('nomeCurso')?.value || '';
    const modalidadeId = document.getElementById('modalidade')?.value || undefined;
    const professorId = document.getElementById('professor')?.value || undefined;

    //garante que somente filtros realmente preenchidos sejam enviados ao getCursos
    const filtros = { nomeCurso, ...(modalidadeId && { modalidadeId }), ...(professorId && { professorId }) };
    console.log('Filtros usados na pesquisa de cursos:', filtros);
    const cursos = await getCursos(filtros);
    console.log('Cursos retornados:', cursos);

    if (container) {
      renderTabelaCursos(container, cursos);
    }

    // cache simples em memória (opcional)
    window.cursosPesquisaResultados = cursos;
   return cursos;
   
  } catch (err) {
    console.error('Erro na pesquisa de cursos:', err);
    const container = document.getElementById('resultados-tabela-cursos');
    if (container) {
      // em caso de erro, renderiza vazio
      renderTabelaCursos(container, []);
    }
    return [];
  }
}

export async function executarPesquisaCursosDetalhado(id) {
  if (!id) {
    throw new Error('ID do curso não informado para detalhamento.');
  }

  try {
    const detalhe = await getCursoDetalhado(id);

    // Normalização defensiva (garante formato previsível)
    return {
      curso: detalhe.curso ?? null,
      professores: Array.isArray(detalhe.professores) ? detalhe.professores : []
    };

  } catch (err) {
    console.error('Erro ao obter detalhamento do curso:', err);
    throw err;
  }
}