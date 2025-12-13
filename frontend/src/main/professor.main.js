import { carregarSelectCidade, carregarSelect } from '../utils/carregar-select.util.js';
import { executarPesquisaProfessores, getProfessorPorId } from '../service/professor.service.js';
import { formatarMoedaBR, formatarDataBR, formatCpf } from '../utils/util.util.js';

import { API_BASE } from '../config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page || '';

  // ==========================
  // PÁGINA: PROFESSORES - PESQUISA
  // ==========================
  if (page === 'professores-pesquisa') {
    carregarSelect({ url: `${API_BASE}/api/cursos`, selectId: 'curso', labelCampo: 'nome' });
    carregarSelect({ url: `${API_BASE}/api/ufs`, selectId: 'uf', labelCampo: 'sigla' });
    await carregarSelectCidade();
    
    //listener do botão pesquisar
    const main = document.querySelector('main');
    if (!main) return;

    const form = main.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await executarPesquisaProfessores();
    });

    const tabelaResultados = document.querySelector('#resultados-tabela-professores');

    // Listener do botão Detalhar professor
    tabelaResultados.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (btn) {
      const id = btn.dataset.id;
      window.location.href = `professores-detalhar.html?id=${id}`;
      }
    });

    const btnLimpar = document.getElementById('Limpar');
      btnLimpar.addEventListener('click', (e) => {
        e.preventDefault();
        form.reset();
        const tabelaResultados = document.querySelector('#resultados-tabela-professores');
        if (tabelaResultados) tabelaResultados.innerHTML = ''; 
      });
  }

  // ==========================
  // PÁGINA: PROFESSORES - DETALHAR
  // ==========================
  if (page === 'professores-detalhar') {

    // Exemplo de pegar o ID pela query string:
    // URL: professores-detalhar.html?id=123
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
    // segurança → se entrar sem ID, volta para pesquisa
    window.location.href = 'professores.html';
    return;
    }
    const professor = await getProfessorPorId(id);
    console.log('Página de detalhamento de professor carregada. ID:', id);
      // Preencher o HTML 
    document.getElementById('professor-nome').textContent = professor.nome || '-';
    document.getElementById('professor-cpf').textContent = formatCpf(professor.cpf) || '-';
    document.getElementById('professor-telefone').textContent = professor.telefone || '-';
    document.getElementById('professor-valor-hora').textContent = professor.valor_hora_aula != null ? `R$ ${Number(professor.valor_hora_aula).toFixed(2)}` : '-';
    document.getElementById('professor-cidade').textContent = professor.cidade_nome || '-';
    document.getElementById('professor-data-nasc').textContent = formatarDataBR(professor.data_nascimento) || '-';
    document.getElementById('professor-status').textContent = professor.status || '-';
    document.getElementById('professor-valor-hora').textContent = 
    professor.valor_hora_aula != null ? formatarMoedaBR(professor.valor_hora_aula) : '-';

  }
});