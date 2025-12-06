import { carregarSelectCidade, carregarSelect } from '../utils/carregar-select.util.js';
import { executarPesquisaProfessores } from '../service/professor.service.js';

import { API_BASE } from '../config.js';

document.addEventListener('DOMContentLoaded', async () => {
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
  const btnLimpar = document.getElementById('Limpar');
    btnLimpar.addEventListener('click', (e) => {
      e.preventDefault();
      form.reset();
      const tabelaResultados = document.querySelector('#resultados-tabela-professores');
      if (tabelaResultados) tabelaResultados.innerHTML = ''; 
    });
//   await Promise.all([
//   carregarSelect({ url: `${API_BASE}/api/setores`, selectId: 'setor', montarLabel: (item) => `${item.sigla} — ${item.nome}` }),
//   carregarSelect({ url: `${API_BASE}/api/regioes`, selectId: 'regiao' }),
//   carregarSelect({ url: `${API_BASE}/api/turnos`, selectId: 'turnos', labelCampo: 'turnos' })
//   ]);
//   carregarSelectMultiplo({
//   url: `${API_BASE}/api/turnos`,
//   selectId: 'turnos-multi',
//   placeholder: 'Selecione',
//   labelCampo: 'turno',
//   });
//   selectFilter('setor');
//   setupModalFocusFix();
// //initModalEditarUsuario() //Chama o modal

//   const btnLimpar = document.getElementById('limpar');
//     btnLimpar.addEventListener('click', (e) => {
//       e.preventDefault();
//       limparFormulario(); // chama a função acima
//     });
//   //Listener Botão novoUsuario
//   const btnPesquisa = document.getElementById('novoUsuario');
//   btnPesquisa.addEventListener('click', (e) => {
//     window.location.href = "src/pages/usuarios/usuarioform.html";
//   });
});