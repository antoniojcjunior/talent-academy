import { carregarSelectCidade , carregarSelect, carregarSelectMultiplo } from '../utils/carregar-select.util.js';
import { executarPesquisaTurmas, obterTurmaPorId } from '../service/turma.service.js';
import { formatarIntervaloDataBR, formatarIntervaloHoraBR, formatarMoedaBR, injetarIndicadorDias } from '../utils/util.util.js';

import { API_BASE } from '../config.js';

document.addEventListener('DOMContentLoaded', async () => {
const page = document.body.dataset.page || '';

  // ==========================
  // PÁGINA: TURMAS - PESQUISA
  // ==========================
  if (page === 'turmas-pesquisa') {

  carregarSelect({ url: `${API_BASE}/api/cursos`, selectId: 'curso', labelCampo: 'nome' });
  carregarSelect({ url: `${API_BASE}/api/professores`, selectId: 'professor', labelCampo: 'nome' });
  carregarSelect({ url: `${API_BASE}/api/modalidades`, selectId: 'modalidade', labelCampo: 'nome' });
  carregarSelect({ url: `${API_BASE}/api/ufs`, selectId: 'uf', labelCampo: 'sigla' });
  await carregarSelectCidade();
  //carregarSelect({ url: `${API_BASE}/api/status_turma`, selectId: 'status_turma', labelCampo: 'descricao' });
  carregarSelectMultiplo({
  url: `${API_BASE}/api/status_turma`,
  selectId: 'status-turma-multi',
  placeholder: 'Selecione o status',
  labelCampo: 'descricao'
  });


  //listener do botão pesquisar
  const main = document.querySelector('main');
  if (!main) return;

  const form = main.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await executarPesquisaTurmas();
  });

  const tabelaResultados = document.querySelector('#resultados-tabela-turmas');

  // Listener do botão Detalhar turma
  tabelaResultados.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-detail');
  if (btn) {
    const id = btn.dataset.id;
    window.location.href = `turmas-detalhar.html?id=${id}`;
    }
  });
  
  //listener do botão excluir turma
  // document.querySelector('#resultados-tabela-turmas')
  // .addEventListener('click', async (e) => {
  //   if (e.target.closest('.btn-delete-turma')) {
  //     const btn = e.target.closest('.btn-delete-turma');
  //     const id = btn.dataset.id;
  //     const nome = btn.dataset.nome;
      
  //     const ok = await excluirTurma(id, nome);
  //     if (ok) {
  //       // se excluiu de fato, recarrega a lista
  //       await executarPesquisaTurmas();
  //     }
  //   }
  // });

  const btnLimpar = document.getElementById('Limpar');
    btnLimpar.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('status-turma-multi').tomselect.clear();
      form.reset(); 
      const tabelaResultados = document.querySelector('#resultados-tabela-turmas');
      if (tabelaResultados) tabelaResultados.innerHTML = '';
    });
  }

  // ==========================
  // PÁGINA: TURMAS - DETALHAR
  // ==========================
  if (page === 'turmas-detalhar') {

    // Exemplo de pegar o ID pela query string:
    // URL: turmas-detalhar.html?id=123
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
    // segurança → se entrar sem ID, volta para pesquisa
    window.location.href = 'turmas.html';
    return;
    }
    const turma = await obterTurmaPorId(id);
    console.log('Página de detalhamento de turma carregada. ID:', id);
      // Preencher o HTML 
    document.getElementById('turma-nome-curso').textContent = turma.curso_nome || '-';
    document.getElementById('turma-modalidade').textContent = turma.modalidade_nome || '-';
    document.getElementById('turma-nome-professor').textContent = turma.professor_nome || '-';
    document.getElementById('turma-nome-local').textContent = turma.local_nome || '-';
    document.getElementById('turma-data-intervalo').textContent = 
    formatarIntervaloDataBR(turma.data_inicio, turma.data_fim);
    document.getElementById('turma-horario-intervalo').textContent = 
    formatarIntervaloHoraBR(turma.hora_inicio, turma.hora_fim);
    document.getElementById('turma-status').textContent = turma.status_nome || '-';
    document.getElementById('turma-custo-professor').textContent = 
    formatarMoedaBR(turma.custo_professor) || '-';
    document.getElementById('turma-valor-negociado-professor').textContent = 
    formatarMoedaBR(turma.valor_negociado_professor) || '-';
    injetarIndicadorDias(turma.dias_aula);

  }
    
});