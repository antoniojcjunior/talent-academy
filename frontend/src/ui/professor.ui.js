import { escapeHtml, formatarMoedaBR, formatarTelefone } from '../utils/util.util.js';

export function renderTabelaProfessores(containerEl, professores) {
  if (!containerEl) return;

  // Caso vazio
  if (!Array.isArray(professores) || professores.length === 0) {
    containerEl.innerHTML = `
      <div class="table-responsive">
        <table id="tabela-professores" class="table">
          <tr>
            <td colspan="4" class="text-center" style="opacity:.7;">Nenhum professor encontrado</td>
          </tr>
        </table>
      </div>
    `;
    return;
  }

  const tableCaption = `
    <caption class="caption-top">
      <div class="caption-inner d-flex justify-content-between">
        <span>Lista de Professores</span>
        <span class="badge bg-secondary">${professores.length}</span>
      </div>
    </caption>
  `;

  const tableHeader = `
    <thead class="table-secondary">
      <tr>
        <th class="text-center">Nome</th>
        <th class="text-center">Telefone</th>
        <th class="text-center">Cidade</th>
        <th class="text-center">Valor Hora Aula</th>
        <th class="text-center">Ações</th>
      </tr>
    </thead>
  `;

  const tableRows = professores
    .map(p => `
    <tr>
      <td class="col-left">${escapeHtml(String(p.nome ?? '').toUpperCase())}</td>
      <td class="text-center">${formatarTelefone(p.telefone ?? '')}</td>
      <td class="col-left">${escapeHtml(String(p.cidade_nome ?? ''))}</td>
      <td class="text-end">${formatarMoedaBR(p.valor_hora_aula ?? '')}</td>
      <td class="text-center acoes">
        <div class="acoes-wrapper d-inline-flex gap-2 align-items-center">
          <button class="btn-edit" data-id="${p.id}" data-nome="${escapeHtml(p.nome ?? '')}" title="Editar">
            <div class="acoes-icone">
            <i class="bi bi-pencil"></i>
            </div>
          </button>
          <button class="btn-detail" data-id="${p.id}" data-nome="${escapeHtml(p.nome ?? '')}" title="Detalhar">
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
      <table id="tabela-professores" class="table table-bordered">
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
window.renderTabelaProfessores = renderTabelaProfessores;
