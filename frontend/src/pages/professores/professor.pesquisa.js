import { API_BASE } from '../../config.js';

function setNameForLabel(form, labelText, name) {
  const labels = Array.from(form.querySelectorAll('label.form-label'));
  const label = labels.find(l => l.textContent.trim().toLowerCase().startsWith(labelText.toLowerCase()));
  if (!label) return null;
  let field = label.nextElementSibling;
  while (field && !/^(SELECT|INPUT|TEXTAREA)$/i.test(field.tagName)) {
    field = field.nextElementSibling;
  }
  if (!field) return null;
  if (!field.name) field.name = name;
  return field;
}

export function initProfessorPesquisa() {
  if (window.__professorPesquisaInitialized) return;
  window.__professorPesquisaInitialized = true;

  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (!main) return;
    const form = main.querySelector('form');
    if (!form) return;

    // garante nomes para campos que não possuem id/name no HTML
    setNameForLabel(form, 'CPF', 'cpf');
    setNameForLabel(form, 'Nome', 'nome');

    // Campos que já possuem id/name no HTML: curso, uf, cidade
    const cursoEl = form.querySelector('#curso') || form.querySelector('select[name="curso"]');
    if (cursoEl && !cursoEl.name) cursoEl.name = 'curso';
    const ufEl = form.querySelector('#uf') || form.querySelector('select[name="uf"]');
    if (ufEl && !ufEl.name) ufEl.name = 'uf';
    const cidadeEl = form.querySelector('#cidade') || form.querySelector('select[name="cidade"]');
    if (cidadeEl && !cidadeEl.name) cidadeEl.name = 'cidade';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await executarPesquisaProfessores(form);
      } catch (err) {
        console.error('Erro na pesquisa de professores:', err);
      }
    });
  });
}

export async function executarPesquisaProfessores(formElement = null) {
  const main = document.querySelector('main');
  const form = formElement || (main ? main.querySelector('form') : null);
  if (!form) throw new Error('Formulário de pesquisa não encontrado.');

  const fd = new FormData(form);
  const params = new URLSearchParams();
  const mappings = ['cpf', 'nome', 'uf', 'cidade', 'curso'];
  mappings.forEach(key => {
    const val = fd.get(key);
    if (val !== null && String(val).trim() !== '') {
      params.append(key, String(val).trim());
    }
  });

  const url = `${API_BASE}/api/professores` + (params.toString() ? `?${params.toString()}` : '');
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Resposta não OK: ${resp.status}`);
    const dados = await resp.json();

    window.professoresPesquisaResultados = dados;
    console.log('professores pesquisados:', dados);
    return dados;
  } catch (err) {
    console.error('Falha ao executar pesquisa de professores:', err);
    throw err;
  }
}

// auto-inicializa quando importado
initProfessorPesquisa();
