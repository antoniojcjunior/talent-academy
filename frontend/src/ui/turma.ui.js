import { escapeHtml, formatarDataBR } from '../utils/util.util.js';

export function renderTabelaTurmas(containerEl, turmas) {
  if (!containerEl) return;

  // Caso vazio
  if (!Array.isArray(turmas) || turmas.length === 0) {
    containerEl.innerHTML = `
      <div class="table-responsive">
        <table id="tabela-turmas" class="table">
          <tr>
            <td colspan="4" class="text-center" style="opacity:.7;">Nenhuma turma encontrada</td>
          </tr>
        </table>
      </div>
    `;
    return;
  }

  const tableCaption = `
    <caption class="caption-top">
      <div class="caption-inner d-flex justify-content-between">
        <span>Lista de Turmas</span>
        <span class="badge bg-secondary">${turmas.length}</span>
      </div>
    </caption>
  `;

  const tableHeader = `
    <thead class="table-secondary">
      <tr>
        <th class="text-center">Curso</th>
        <th class="text-center">Professor</th>
        <th class="text-center">Início</th>
        <th class="text-center">Fim</th>
        <th class="text-center">Local</th>
        <th class="text-center">Ações</th>
      </tr>
    </thead>
  `;

  const tableRows = turmas
    .map(p => `
    <tr>
      <td class="col-left">${escapeHtml(String(p.curso_nome ?? '').toUpperCase())}</td>
      <td class="text-center">${escapeHtml(String(p.professor_nome ?? ''))}</td>
      <td class="col-left">${formatarDataBR(String(p.data_inicio ?? ''))}</td>
      <td class="col-left">${formatarDataBR(String(p.data_fim ?? ''))}</td>
      <td class="text-center">${escapeHtml(String(p.cidade_nome ?? ''))}</td>
      <td class="text-center acoes">
        <div class="acoes-wrapper">
          <button class="btn-deletar btn-delete-turma" data-id="${p.id}" data-nome="${escapeHtml(`${p.curso_nome} - ${formatarDataBR(p.data_inicio)}`)}" title="Excluir">
            <div class="acoes-icone">🗑️</div>
          </button>
          <button class="btn-editar btn-edita-turma" data-id="${p.id}" data-nome="${escapeHtml(`${p.curso_nome} - ${formatarDataBR(p.data_inicio)}`)}" title="Editar">
            <div class="acoes-icone">🖊️</div>
          </button>
        </div>
      </td>
    </tr>
    `)
    .join('');

  const fullTableHtml = `
    <div class="table-responsive">
      <table id="tabela-turmas" class="table table-bordered">
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
window.renderTabelaTurmas = renderTabelaTurmas;
