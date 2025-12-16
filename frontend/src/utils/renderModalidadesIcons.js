// Renderiza ícones das modalidades disponíveis
export function renderModalidadesIcons(modalidades) {
  if (!Array.isArray(modalidades) || modalidades.length === 0) {
    return '<span style="opacity:.6;">—</span>';
  }

  const ICONES_MODALIDADE = {
    1: '<i class="bi bi-laptop text-primary" title="Online"></i>',
    2: '<i class="bi bi-geo-alt text-primary" title="Presencial"></i>',
    3: '<i class="bi bi-h-circle text-primary" title="Híbrida"></i>'
  };

  return modalidades
    .filter(id => ICONES_MODALIDADE[id]) // remove null / desconhecidos
    .sort((a, b) => a - b)               // ordem visual previsível
    .map(id => ICONES_MODALIDADE[id])
    .join(' ');
}