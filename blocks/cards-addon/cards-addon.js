/* eslint-disable max-len */
const chevronSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="24" viewBox="0 0 13 24" fill="none"><path d="M0.5 0.5L11.8333 11.8333L0.5 23.1667" stroke="#0D0D0D" stroke-miterlimit="10" stroke-linecap="round"></path></svg>';
/* eslint-enable max-len */

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // Column 0: icon (picture or inline SVG)
    const iconCol = cols[0];
    // Column 1: link text
    const textCol = cols[1];

    const link = textCol?.querySelector('a');
    const href = link?.href || '#';
    const text = link?.textContent?.trim() || textCol?.textContent?.trim() || '';

    const a = document.createElement('a');
    a.href = href;
    a.classList.add('cards-addon-card');

    // Icon wrapper
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('cards-addon-icon');
    const pic = iconCol?.querySelector('picture');
    if (pic) {
      iconDiv.append(pic);
    } else if (iconCol) {
      iconDiv.innerHTML = iconCol.innerHTML;
    }
    a.append(iconDiv);

    // Text
    const textSpan = document.createElement('span');
    textSpan.classList.add('cards-addon-text');
    textSpan.textContent = text;
    a.append(textSpan);

    // Chevron arrow
    const arrowDiv = document.createElement('div');
    arrowDiv.classList.add('cards-addon-arrow');
    arrowDiv.innerHTML = chevronSVG;
    a.append(arrowDiv);

    li.append(a);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
