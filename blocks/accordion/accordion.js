/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

const SPEC_ICONS = {
  Sistema: 'android',
  Conectividad: 'network-tower',
  Pantalla: 'mobile',
  'Cámara': 'camera',
  Memoria: 'cpu',
  'Batería': 'battery',
  Medidas: 'weight',
  'Otras Características': 'settings',
};

function buildSpecTable(body) {
  const text = body.textContent;
  const specLabels = Object.keys(SPEC_ICONS);
  const hasSpecs = specLabels.filter((l) => text.includes(`${l}:`)).length >= 3;
  if (!hasSpecs) return false;

  const html = body.innerHTML;
  const rows = [];
  specLabels.forEach((label) => {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`<strong>${escapedLabel}:?</strong>\\s*([\\s\\S]*?)(?=<strong>|$)`);
    const match = regex.exec(html);
    if (match) {
      const raw = match[1].replace(/<[^>]+>/g, ' ').trim();
      const valueText = raw.replace(/\s*·\s*/g, '\n');
      rows.push({ label, values: valueText.split('\n').filter(Boolean) });
    }
  });

  if (rows.length === 0) return false;

  const table = document.createElement('div');
  table.className = 'accordion-spec-table';

  rows.forEach((row) => {
    const tr = document.createElement('div');
    tr.className = 'accordion-spec-row';

    const iconName = SPEC_ICONS[row.label] || 'settings';
    const th = document.createElement('div');
    th.className = 'accordion-spec-label';
    th.innerHTML = `<span class="icon icon-${iconName}"><img src="/icons/${iconName}.svg" alt="${row.label}" loading="lazy"></span><strong>${row.label}</strong>`;

    const td = document.createElement('div');
    td.className = 'accordion-spec-values';
    td.innerHTML = row.values.map((v) => `<span>${v.trim()}</span>`).join('');

    tr.append(th, td);
    table.append(tr);
  });

  body.textContent = '';
  body.append(table);
  return true;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-item-body';

    buildSpecTable(body);

    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
