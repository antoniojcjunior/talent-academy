import { formatarMoedaBR } from '../utils/util.util.js';
import { carregarSelectCidade, carregarSelectMultiplo, carregarSelect, selectFilter } from '../utils/carregar-select.util.js';
import { executarPesquisaCursos, executarPesquisaCursosDetalhado } from '../service/curso.service.js';
import { renderTabelaProfessoresDoCurso } from '../ui/curso.ui.js';
import { renderModalidadesIcons } from '../utils/renderModalidadesIcons.js';
import { API_BASE } from '../config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page || '';
  // ==========================
  // PÁGINA: CURSOS - PESQUISA
  // ==========================
  if (page === 'cursos-pesquisa') {
    // Carrega selects de Modalidade e Professor
    carregarSelect({ url: `${API_BASE}/api/professores`, selectId: 'professor', labelCampo: 'nome' });
    carregarSelect({ url: `${API_BASE}/api/modalidades`, selectId: 'modalidade', labelCampo: 'nome' });

    const main = document.querySelector('main');
    if (!main) return;

    const form = main.querySelector('form');
    if (!form) return;

    // Listener do botão Pesquisar
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await executarPesquisaCursos();
      });
      const tabelaResultados = document.querySelector('#resultados-tabela-cursos');

    // Listener do botão Detalhar Curso
    tabelaResultados.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (btn) {
      const id = btn.dataset.id;
      window.location.href = `cursos-detalhar.html?id=${id}`;
      }
    });

    // Listener do botão Excluir Curso (na tabela de resultados)
        // if (tabelaResultados) {
        //   tabelaResultados.addEventListener('click', async (e) => {
        //     const botaoDelete = e.target.closest('.btn-delete');
        //     if (botaoDelete) {
        //       const id = botaoDelete.dataset.id;
        //       const nome = botaoDelete.dataset.nome;

        //       const ok = await excluirCurso(id, nome);
        //       if (ok) {
        //         // se excluiu de fato, recarrega a lista
        //         await executarPesquisaLocais();
        //       }
        //     }
        //   });
        // }

    // Botão Limpar
    const btnLimpar = document.getElementById('Limpar');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', (e) => {
        e.preventDefault();
        form.reset();
        // limpar a tabela de resultados
        const tabelaResultados = document.querySelector('#resultados-tabela-cursos');
        if (tabelaResultados) tabelaResultados.innerHTML = '';
      });
    }
 }

// ==========================
// PÁGINA: CURSOS - DETALHAR
// ==========================
if (page === 'cursos-detalhar') {
  // Exemplo de pegar o ID pela query string:
  // URL: cursos-detalhar.html?id=123
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    // segurança → se entrar sem ID, volta para pesquisa
    window.location.href = 'cursos.html';
    return;
  }

  try {
    // service retorna { curso, professores }
    const { curso, professores } = await executarPesquisaCursosDetalhado(id);

    if (!curso) {
      // segurança extra (caso venha null)
      window.location.href = 'cursos.html';
      return;
    }

    // Preencher o HTML (campos fixos)
    document.getElementById('curso-nome').textContent = curso.nome || '-';
    document.getElementById('curso-carga-horaria').textContent = curso.carga_horaria_horas || '-';
    // Array de Modalidades do curso
    const modalidadesArr = Array.isArray(curso.modalidades_disponiveis)
      ? curso.modalidades_disponiveis
      : [];
    document.getElementById('curso-modalidade').innerHTML = renderModalidadesIcons(modalidadesArr);

    document.getElementById('curso-valor-inscricao').textContent =
    curso.valor_padrao_inscricao != null ? formatarMoedaBR(curso.valor_padrao_inscricao) : '-';

    // Carregar tabela de professores vinculados ao curso
    const tabelaProfessoresContainer = document.getElementById('tabela-professores-curso');
    if (tabelaProfessoresContainer) {
      renderTabelaProfessoresDoCurso(tabelaProfessoresContainer, professores);
    }
  } catch (err) {
    console.error('Erro ao carregar detalhamento do curso:', err);
    // fallback: volta para pesquisa (ou você pode exibir um alerta/modal aqui)
    window.location.href = 'cursos.html';
  }
}

});