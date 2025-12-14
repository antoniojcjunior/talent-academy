import { showAlert } from './show-alert.util.js';

// Função para limpar formulário
export function limparFormulario() {
  // 1. Limpeza do Tom Select 'setor'
  // Deve ser feito antes do form.reset(), ou a lógica de select pode interferir
  const elementosTomSelect = document.querySelectorAll('[data-tomselect]');
  
  // Verifica se o elemento existe e se o Tom Select foi inicializado (.tomselect)
  //if (selectSetor && selectSetor.tomselect) {
      // Usa o método de API 'clear()' para remover a seleção do Tom Select
  elementosTomSelect.forEach(el => {
  if (el.tomselect) {
    el.tomselect.clear();          // limpa seleção
    // el.tomselect.clearOptions(); // só use se você quiser remover TODAS as opções também
    }
  });

  const form = document.getElementById('formulario');
  form.reset();

  form.querySelectorAll('select').forEach((sel) => {
  let placeholder = sel.querySelector('option[value=""]');
                                    /*verificar se o <select> já tem essa <option> vazia dentro dele.
                                    Ele procura se o elemento existe antes de criar outro.*/
  if (!placeholder) { //trata se o <select> não tiver a <option value="">
    placeholder = document.createElement('option');
    placeholder.value = '';
    sel.insertBefore(placeholder, sel.firstChild);
  }
  
  console.log(placeholder);
  placeholder.textContent = sel.dataset.placeholder || '-- Escolha uma opção --';
                                    /*se sel.dataset.placeholder existir e tiver conteúdo, ele será usado.
                                    Se não existir, insere na option o texto padrão '-- Escolha uma opção --'.*/
  sel.value = ''; /*Define o valor atual do <select> como vazio, fazendo o placeholder aparecer selecionado.*/
});
}
//Aplica mascara nos input de CPF
export function aplicarMascaraCPF(elementId = 'cpf') {
  const input = document.getElementById(elementId);
  if (!input) return;

    const formatarCPF = (valor) => {
    let v = valor.replace(/\D/g, '');

    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 9) {
      v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    }
    return v;
  };

  // 1. 📍 Aplica a máscara no valor INICIAL (ao carregar o formulário)
  // Isso faz o CPF aparecer como 123.456.789-01 na tela.
  input.value = formatarCPF(input.value); 

  // 2. Máscara durante a digitação
  input.addEventListener('input', (e) => {
    e.target.value = formatarCPF(e.target.value);
  });

  // Remove formatação ao sair do campo (onblur)
  /*input.addEventListener('blur', (e) => {
    const somenteNumeros = e.target.value.replace(/\D/g, '');
    e.target.value = somenteNumeros;
  });*/
}
//Aplica mascara nos input de valores
export function aplicarMascaraMonetaria(elementId = 'remuneracao', options = {}) {
  
  // 1. Verificar se a biblioteca VMasker está carregada
  if (typeof VMasker === 'undefined') {
      console.error("VMasker não está definido. Verifique a ordem de carregamento dos scripts no HTML.");
      return;
  }

  // 2. Encontrar o elemento HTML usando o ID
  const inputElement = document.getElementById(elementId);

  if (!inputElement) {
      console.warn(`Elemento com ID '${elementId}' não encontrado. A máscara não foi aplicada.`);
      return;
  }

  // 3. Definir as opções padrão para o formato BRL (Brasileiro)
  const defaultOptions = {
      precision: 2,   // 2 casas decimais
      separator: ',', // Separador decimal (vírgula)
      delimiter: '.', // Separador de milhares (ponto)
      unit: 'R$ ',    // Prefixo
      zeroes: 0, 
      reverse: true   // Aplica a máscara da direita para a esquerda (padrão de moedas)
  };

  // 4. Juntar as opções padrão com as opções passadas, se houver customização
  const finalOptions = { ...defaultOptions, ...options };

  // 5. Aplicar a máscara no elemento
  VMasker(inputElement).maskMoney(finalOptions);
  
  console.log(`Máscara monetária aplicada ao elemento com ID: ${elementId}`);
}
//Limita a data nascimento menor do que hoje
/**
 * Limita o valor máximo de um campo de data (input type="date") para a data de hoje
 * e verifica se o valor atual não está no futuro.
 *
 * @param {string} inputId O ID do elemento input de data a ser tratado.
 */
export function limitaDataNascimento(inputId) {
  // gera data de hoje no formato AAAA-MM-DD
  const hoje = new Date().toISOString().split('T')[0];
  // aplica como valor máximo do input
  document.getElementById(inputId).setAttribute('max', hoje);

  const data_nascimento = document.getElementById(inputId).value;
  if (data_nascimento && data_nascimento > new Date().toISOString().split('T')[0]) {
    alert('A data de nascimento não pode ser no futuro.');
    return;
  }
}

// Converte datas para formato ISO (YYYY-MM-DD) para comparação
function normalizaData(valor) {
  if (!valor) return '';

  // Caso mobile: dd/mm/aaaa
  if (valor.includes('/')) {
    const [dia, mes, ano] = valor.split('/');
    if (!dia || !mes || !ano) return '';
    const dia2 = dia.padStart(2, '0');
    const mes2 = mes.padStart(2, '0');
    return `${ano}-${mes2}-${dia2}`; // YYYY-MM-DD
  }

  // Caso desktop: já vem como YYYY-MM-DD
  return valor;
}

//Limita a data nascimento a partir do valor inicial digitado
export function restingeIntervaloDatas(idInicio, idFim) {
  const inicioInput = document.getElementById(idInicio);
  const fimInput    = document.getElementById(idFim);

  if (!inicioInput || !fimInput) return;

  // valida quando o usuário termina de mexer na data final
  fimInput.addEventListener('blur', () => {
    const inicioRaw = inicioInput.value; // pode ser YYYY-MM-DD ou dd/mm/aaaa
    const fimRaw    = fimInput.value;

    if (!fimRaw) return;

    const inicio = normalizaData(inicioRaw);
    const fim    = normalizaData(fimRaw);

    if (!inicio || !fim) return;

    if (fim < inicio) {
      showAlert('A data final não pode ser anterior à data inicial.');
      fimInput.value = '';
      fimInput.focus();
    }
  });

  // se o usuário mudar a data de início depois de já ter preenchido a fim
  inicioInput.addEventListener('blur', () => {
    const inicioRaw = inicioInput.value;
    const fimRaw    = fimInput.value;

    if (!inicioRaw || !fimRaw) return;

    const inicio = normalizaData(inicioRaw);
    const fim    = normalizaData(fimRaw);

    if (!inicio || !fim) return;

    if (fim < inicio) {
      // aqui dá pra só limpar silenciosamente
      fimInput.value = '';
    }
  });
}

//Valida se todos os campos foram preenchidos e apresenta msg caso nao tenham sido
export function validarCamposObrigatorios(campos) {
for (const campo of campos) {
  if (!campo.valor) {
    showAlert(campo.mensagem);
    return false;
  }
}
return true;
} 
//CPF retornado no get e inserido na tela de resultado
export function formatCpf(cpf) {
  const d = String(cpf || '').replace(/\D/g, '');
  if (d.length !== 11) return (cpf ?? '').toString();
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
//ajuste de tag tbody na apresentação do resultado
export function escapeHtml(str) { 
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
//Formata um valor R$ proveniente do BD
export function formatarMoedaBR(valor) {
  if (valor == null || valor === '') return ''; // evita mostrar "R$ NaN"
  const numero = Number(valor);
  if (isNaN(numero)) return valor; // se não for número, retorna como está
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
//Formata uma string de data from BD (ex: YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY).
// export const formatDateToBR = (dateString) => {
//     // Retorna string vazia se o valor for nulo, indefinido ou vazio
//     if (!dateString) {
//         return '';
//     }

//     // 1. Cria um objeto Date. Adicionar 'T00:00:00' ajuda a garantir que a data seja 
//     // interpretada como local para evitar problemas de TimeZone em datas puras (YYYY-MM-DD).
//     const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);

//     // Verifica se a data é válida
//     if (isNaN(date.getTime())) {
//         // Se for uma string inválida, retorna a string original ou vazia, dependendo da necessidade
//         return dateString; 
//     }

//     // 2. Utiliza toLocaleDateString com o locale 'pt-BR' para formatar
//     return date.toLocaleDateString('pt-BR', { 
//         day: '2-digit', 
//         month: '2-digit', 
//         year: 'numeric' 
//     });
// };

// Formata número de telefone proveniente do BD (varchar)
export function formatarTelefone(valor) {
  if (!valor) return '';

  // Remove tudo que não for dígito
  const numeros = valor.replace(/\D/g, '');

  // Se não sobrar dígito, devolve original
  if (numeros.length === 0) return valor;

  // Celular com DDD → 11 dígitos
  if (numeros.length === 11) {
    const ddd = numeros.slice(0, 2);
    const parte1 = numeros.slice(2, 7);
    const parte2 = numeros.slice(7);
    return `(${ddd}) ${parte1}-${parte2}`;
  }

  // Fixo com DDD → 10 dígitos
  if (numeros.length === 10) {
    const ddd = numeros.slice(0, 2);
    const parte1 = numeros.slice(2, 6);
    const parte2 = numeros.slice(6);
    return `(${ddd}) ${parte1}-${parte2}`;
  }

  // Celular sem DDD → 9 dígitos
  if (numeros.length === 9) {
    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }

  // Fixo sem DDD → 8 dígitos
  if (numeros.length === 8) {
    return `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
  }

  // Se tiver outro formato, devolve original sem mexer
  return valor;
}

// Formata data proveniente do BD (ISO 8601) para formato brasileiro (DD/MM/YYYY)
export function formatarDataBR(dataISO) {
  if (!dataISO) return '';

  const data = new Date(dataISO);
  if (isNaN(data)) return dataISO; // se não for data válida, retorna como está

  return data.toLocaleDateString('pt-BR', {
    timeZone: 'UTC'  // evita problemas de fuso horário
  });
}
// Apresenta intervalo de datas no formato brasileiro
export function formatarIntervaloDataBR(dataInicioISO, dataFimISO) {
  // Formata as datas individualmente
  const dataInicioFormatada = formatarDataBR(dataInicioISO);
  const dataFimFormatada = formatarDataBR(dataFimISO);

  // Verifica se ambas as datas são válidas
  if (dataInicioFormatada && dataFimFormatada) {
    return `${dataInicioFormatada} a ${dataFimFormatada}`;
  }

  // Se apenas uma for válida, retorna apenas ela
  if (dataInicioFormatada) {
    return dataInicioFormatada;
  }
  
  return dataFimFormatada || '-'; // Retorna a data fim ou '-'
}

// Formata hora proveniente do BD (ISO 8601) para formato brasileiro (HH:MM)
export function formatarHoraBR(dataISO) {
  // 1. Verifica se a entrada existe
  if (!dataISO || typeof dataISO !== 'string') {
    return '';
  }
  // 2. Verifica se a string tem pelo menos o formato HH:mm (5 caracteres)
  if (dataISO.length >= 5) {
    // Retorna apenas os 5 primeiros caracteres (HH:mm)
    return dataISO.substring(0, 5); 
  }
  // 3. Se por algum motivo a string for menor que 5 caracteres, retorna vazio ou a string original
  return dataISO;
}
// Apresenta intervalo de horas no formato brasileiro
export function formatarIntervaloHoraBR(horaInicioISO, horaFimISO) {
  const horaInicioFormatada = formatarHoraBR(horaInicioISO);
  const horaFimFormatada = formatarHoraBR(horaFimISO);

  // Verifica se ambos os horários são válidos
  if (horaInicioFormatada && horaFimFormatada) {
    return `${horaInicioFormatada} a ${horaFimFormatada}`;
  }

  // Se apenas um for válido, retorna apenas ele
  if (horaInicioFormatada) {
    return horaInicioFormatada;
  }
  
  return horaFimFormatada || '-'; // Retorna o horário fim ou '-'
}
// Mapa de letras para os dias da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
const MAPA_LETRAS_DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export function injetarIndicadorDias(indicesDias) {
  const container = document.getElementById('turma-dias-indicador');
  
  if (!container) return;

  // Garante que indicesDias é um array, mesmo que venha nulo/undefined
  const diasAtivos = Array.isArray(indicesDias) ? indicesDias : [];

  container.innerHTML = ''; 

  // Se não houver dias, exibe uma mensagem
  if (diasAtivos.length === 0) {
    container.textContent = 'Dias não informados';
    return;
  }

  // Itera sobre o mapa de letras de D a S
  MAPA_LETRAS_DIAS.forEach((letra, index) => {
    const span = document.createElement('span');
    span.textContent = letra;
    span.classList.add('dia-indicador');

    // Verifica se o índice está presente no array
    if (diasAtivos.includes(index)) {
      span.classList.add('active');
    }

    container.appendChild(span);
  });
}