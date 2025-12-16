import { escapeHtml, formatarMoedaBR } from '../utils/util.util.js';
import { renderModalidadesIcons } from '../utils/renderModalidadesIcons.js';


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
        <th class="text-center">Ações</th>
      </tr>
    </thead>
  `;

  const tableRows = cursos
    .map(l => `
      <tr>
        <td>${escapeHtml(l.nome ?? '')}</td>
        <td class="text-center">${escapeHtml(l.carga_horaria_horas ?? '')}</td>
        <td class="text-center">${renderModalidadesIcons(l.modalidades_disponiveis)}</td>
        <td class="text-end">${formatarMoedaBR(l.valor_padrao_inscricao ?? '')}</td>
        <td class="text-center acoes">
          <div class="acoes-wrapper d-inline-flex gap-2 align-items-center"">
            <button class="btn-detail" data-id="${l.id}" data-nome="${escapeHtml(l.nome ?? '')}" title="Editar">
              <div class="acoes-icone">
              <i class="bi bi-search"></i>
              </div>
            </button>
            <button class="btn-delete" data-id="${l.id}" data-nome="${escapeHtml(l.nome ?? '')}" title="Excluir">
              <div class="acoes-icone">
              <i class="bi bi-pencil"></i>
              </div>
            </button>
          </div>
        </td>
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

// Tabela Professores do Curso (detalhamento)
export function renderTabelaProfessoresDoCurso(containerEl, professores) {
  if (!containerEl) return;

  // Caso vazio
  if (!Array.isArray(professores) || professores.length === 0) {
    containerEl.innerHTML = `
      <div class="table-responsive">
        <table id="tabela-professores-curso" class="table">
          <tr>
            <td colspan="3" class="text-center" style="opacity:.7;">Nenhum professor cadastrado para esse curso</td>
          </tr>
        </table>
      </div>
    `;
    return;
  }

  const tableCaption = `
    <caption class="caption-top">
      <div class="caption-inner d-flex justify-content-between">
        <span>Professores do Curso</span>
        <span class="badge bg-secondary">${professores.length}</span>
      </div>
    </caption>
  `;

  const tableHeader = `
    <thead class="table-secondary">
      <tr>
        <th class="text-center align-middle">Nome</th>
        <th class="text-center align-middle">Telefone</th>
        <th class="text-center align-middle">Valor Hora-Aula</th>
      </tr>
    </thead>
  `;

  const tableRows = professores
    .map(p => `
      <tr>
        <td>${escapeHtml(p.nome ?? '')}</td>
        <td>${escapeHtml(p.telefone ?? '')}</td>
        <td class="text-end">${formatarMoedaBR(p.valor_hora_aula ?? '')}</td>
      </tr>
    `)
    .join('');

  const fullTableHtml = `
    <div class="table-responsive">
      <table id="tabela-professores-curso" class="table table-bordered">
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
