import { carregarSelectCidade, carregarSelectMultiplo, carregarSelect, selectFilter } from '../utils/carregar-select.util.js';
import { executarPesquisaCursos } from '../service/curso.service.js';
import { API_BASE } from '../config.js';

/*document.addEventListener('DOMContentLoaded', carregarSetores); /*chama a função carregarSetores depois que o HTML temrina de carregar*/
document.addEventListener('DOMContentLoaded', async () => {
//   initPesquisaPage();//essa função ativa o listener do botão pesquisar
//   configurarDelecaoDeUsuarios();//essa função ativa o listener do botão Lixeira apagar
//   aplicarMascaraCPF();
  
//   const dataNascInicioEl = document.getElementById('data_nascimento_inicio');
//   const dataNascFimEl = document.getElementById('data_nascimento_fim');
  
//   limitaDataNascimento(dataNascInicioEl.id);
//   limitaDataNascimento(dataNascFimEl.id);

//   restingeIntervaloDatas(dataNascInicioEl.id, dataNascFimEl.id);
  
//   ajustarCampoDataParaMobile(dataNascInicioEl);
//   ajustarCampoDataParaMobile(dataNascFimEl);
  
  //carregar os selects específicos desta página
  carregarSelect({ url: `${API_BASE}/api/cursos`, selectId: 'curso', labelCampo: 'nome' });
  carregarSelect({ url: `${API_BASE}/api/professores`, selectId: 'professor', labelCampo: 'nome' });
  carregarSelect({ url: `${API_BASE}/api/modalidades`, selectId: 'modalidade', labelCampo: 'nome' });

  //listener do botão pesquisar
  const main = document.querySelector('main');
  if (!main) return;

  const form = main.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await executarPesquisaCursos();
  });
  const btnLimpar = document.getElementById('Limpar');
    btnLimpar.addEventListener('click', (e) => {
      e.preventDefault();
      form.reset();
      const tabelaResultados = document.querySelector('#resultados-tabela-cursos');
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