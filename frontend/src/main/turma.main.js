import { carregarSelectCidade , carregarSelect, carregarSelectMultiplo } from '../utils/carregar-select.util.js';
import { executarPesquisaTurmas, excluirTurma } from '../service/turma.service.js';

import { API_BASE } from '../config.js';

document.addEventListener('DOMContentLoaded', async () => {
  carregarSelect({ url: `${API_BASE}/api/cursos`, selectId: 'curso', labelCampo: 'nome' });
  carregarSelect({ url: `${API_BASE}/api/professores`, selectId: 'professor', labelCampo: 'nome' });
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
  //listener do botão excluir turma
  document.querySelector('#resultados-tabela-turmas')
  .addEventListener('click', async (e) => {
    if (e.target.closest('.btn-delete-turma')) {
      const btn = e.target.closest('.btn-delete-turma');
      const id = btn.dataset.id;
      const nome = btn.dataset.nome;
      
      const ok = await excluirTurma(id, nome);
      if (ok) {
        // se excluiu de fato, recarrega a lista
        await executarPesquisaTurmas();
      }
    }
  });

  const btnLimpar = document.getElementById('Limpar');
    btnLimpar.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('status-turma-multi').tomselect.clear();
      form.reset(); 
      const tabelaResultados = document.querySelector('#resultados-tabela-turmas');
      if (tabelaResultados) tabelaResultados.innerHTML = '';
    });
});