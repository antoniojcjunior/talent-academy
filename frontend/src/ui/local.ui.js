import { escapeHtml, formatarMoedaBR } from '../utils/util.util.js';

export function renderTabelaLocais(containerEl, locais) {
  if (!containerEl) return;

  // Caso vazio
  if (!Array.isArray(locais) || locais.length === 0) {
    containerEl.innerHTML = `
      <div class="table-responsive">
        <table id="tabela-locais" class="table">
          <tr>
            <td colspan="4" class="text-center" style="opacity:.7;">Nenhum local encontrado</td>
          </tr>
        </table>
      </div>
    `;
    return;
  }

  const tableCaption = `
    <caption class="caption-top">
      <div class="caption-inner d-flex justify-content-between">
        <span>Lista de Locais</span>
        <span class="badge bg-secondary">${locais.length}</span>
      </div>
    </caption>
  `;

  const tableHeader = `
    <thead class="table-secondary">
      <tr>
        <th class="text-center">Nome</th>
        <th class="text-center">Cidade</th>
        <th class="text-center">UF</th>
        <th class="text-center">Bairro</th>
        <th class="text-center">Valor aluguel (dia)</th>
        <th class="text-center">Ações</th>
      </tr>
    </thead>
  `;

  const tableRows = locais
    .map(l => `
      <tr>
        <td>${escapeHtml(l.nome ?? '')}</td>
        <td class="text-start">${escapeHtml(l.cidade_nome ?? '')}</td>
        <td class="text-start">${escapeHtml(l.uf_sigla ?? '')}</td>
        <td class="text-start">${escapeHtml(l.bairro ?? '')}</td>
        <td class="text-end">${formatarMoedaBR(l.valor_aluguel_dia)}</td>
        <td class="text-center acoes">
          <div class="acoes-wrapper">
            <button class="btn-delete" data-id="${l.id}" data-nome="${escapeHtml(l.nome ?? '')}" title="Excluir">
              <div class="acoes-icone">
              <i class="bi bi-trash"></i>
              </div>
            </button>
            <button class="btn-detail" data-id="${l.id}" data-nome="${escapeHtml(l.nome ?? '')}" title="Editar">
              <div class="acoes-icone">
              <i class="bi bi-search"></i>
              </div>
            </button>
          </div>
        </td>
      </tr>
    `)
    .join('');

  const fullTableHtml = `
    <div class="table-responsive">
      <table id="tabela-locais" class="table table-bordered">
        ${tableCaption}
        ${tableHeader}
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  `;

  containerEl.innerHTML = fullTableHtml;

  // Scroll para exibir a tabela
  containerEl.scrollIntoView({ behavior: 'smooth' });
}

// opcional para debug no console
window.renderTabelaLocais = renderTabelaLocais;
