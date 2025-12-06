import { escapeHtml, formatarMoedaBR } from '../utils/util.util.js';

export function renderTabelaCursos(containerEl, cursos) {
  if (!containerEl) return;

  // Caso vazio
  if (!Array.isArray(cursos) || cursos.length === 0) {
    containerEl.innerHTML = `
      <div class="table-responsive">
        <table id="tabela-cursos" class="table">
          <tr>
            <td colspan="4" class="text-center" style="opacity:.7;">Nenhum curso encontrado</td>
          </tr>
        </table>
      </div>
    `;
    return;
  }

  const tableCaption = `
    <caption class="caption-top">
      <div class="caption-inner d-flex justify-content-between">
        <span>Lista de Cursos</span>
        <span class="badge bg-secondary">${cursos.length}</span>
      </div>
    </caption>
  `;

  const tableHeader = `
    <thead class="table-secondary">
      <tr>
        <th class="text-center align-middle">Nome</th>
        <th class="text-center align-middle">Carga Horária</th>
        <th class="text-center align-middle">Modalidade</th>
        <th class="text-center align-middle">Valor Inscrição</th>
      </tr>
    </thead>
  `;

  const tableRows = cursos
    .map(l => `
      <tr>
        <td>${escapeHtml(l.nome ?? '')}</td>
        <td class="text-center">${escapeHtml(l.carga_horaria_horas ?? '')}</td>
        <td>${escapeHtml(l.modalidade_nome ?? '')}</td>
        <td class="text-end">${formatarMoedaBR(l.valor_padrao_inscricao ?? '')}</td>
      </tr>
    `)
    .join('');

  const fullTableHtml = `
    <div class="table-responsive">
      <table id="tabela-cursos" class="table table-bordered">
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
window.renderTabelaCursos = renderTabelaCursos;
