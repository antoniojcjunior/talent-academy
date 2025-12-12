import { carregarSelectCidade, carregarSelect } from '../utils/carregar-select.util.js';
import { formatarMoedaBR } from '../utils/util.util.js';
import { executarPesquisaLocais, excluirLocal, getLocalPorId } from '../service/local.service.js';
import { API_BASE } from '../config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page || '';

  // ==========================
  // PÁGINA: LOCAIS - PESQUISA
  // ==========================
  if (page === 'locais-pesquisa') {
    // Carrega selects de UF e Cidade
    carregarSelect({ url: `${API_BASE}/api/ufs`, selectId: 'uf', labelCampo: 'sigla' });
    await carregarSelectCidade();

    const main = document.querySelector('main');
    if (!main) return;

    const form = main.querySelector('form');
    if (!form) return;

    // Listener do botão Pesquisar
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await executarPesquisaLocais();
    });
    const tabelaResultados = document.querySelector('#resultados-tabela-locais');

    // Listener do botão Detalhar Local
    tabelaResultados.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (btn) {
      const id = btn.dataset.id;
      window.location.href = `locais-detalhar.html?id=${id}`;
      }
    });
    // Listener do botão Excluir Local (na tabela de resultados)
    if (tabelaResultados) {
      tabelaResultados.addEventListener('click', async (e) => {
        const botaoDelete = e.target.closest('.btn-delete');
        if (botaoDelete) {
          const id = botaoDelete.dataset.id;
          const nome = botaoDelete.dataset.nome;

          const ok = await excluirLocal(id, nome);
          if (ok) {
            // se excluiu de fato, recarrega a lista
            await executarPesquisaLocais();
          }
        }
      });
    }

    // Botão Limpar (reset do form)
    const btnLimpar = document.getElementById('Limpar');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', (e) => {
        e.preventDefault();
        form.reset();
        // limpar a tabela de resultados
        const tabelaResultados = document.querySelector('#resultados-tabela-locais');
        if (tabelaResultados) tabelaResultados.innerHTML = '';
      });
    }
  }

  // ==========================
  // PÁGINA: LOCAIS - DETALHAR
  // ==========================
  if (page === 'locais-detalhar') {

    // Exemplo de pegar o ID pela query string:
    // URL: locais-detalhar.html?id=123
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
   
   if (!id) {
    // segurança → se entrar sem ID, volta para pesquisa
    window.location.href = 'locais.html';
    return;
    }
    const local = await getLocalPorId(id);
    console.log('Página de detalhamento de local carregada. ID:', id);
     // Preencher o HTML 
    document.getElementById('local-nome').textContent = local.nome || '-';
    document.getElementById('local-logradouro').textContent = local.logradouro || '-';
    document.getElementById('local-numero').textContent = local.numero || '-';
    document.getElementById('local-complemento').textContent = local.complemento || '-';
    document.getElementById('local-bairro').textContent = local.bairro || '-';
    document.getElementById('local-cep').textContent = local.cep || '-';
    document.getElementById('local-telefone').textContent = local.telefone || '-';
    document.getElementById('local-cidade-nome').textContent = local.cidade_nome || '-';
    document.getElementById('local-uf-sigla').textContent = local.uf_sigla || '-';
    document.getElementById('local-valor-aluguel-dia').textContent = 
    local.valor_aluguel_dia != null ? formatarMoedaBR(local.valor_aluguel_dia) : '-';
    document.getElementById('local-valor-aluguel-turno').textContent = 
    local.valor_aluguel_turno != null ? formatarMoedaBR(local.valor_aluguel_turno) : '-';

  }
});
