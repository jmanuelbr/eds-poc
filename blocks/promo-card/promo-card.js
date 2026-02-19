export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  rows.forEach((row) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.className = 'promo-card-item';

    // First column: image
    const imgCol = cols[0];
    if (imgCol) {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'promo-card-image';
      imgWrapper.append(...imgCol.childNodes);
      card.append(imgWrapper);
    }

    // Second column: text content with collapsible
    const textCol = cols[1];
    if (textCol) {
      const textWrapper = document.createElement('div');
      textWrapper.className = 'promo-card-text';

      // Split content at <br> tags into separate lines
      const container = textCol.querySelector('p') || textCol;
      const html = container.innerHTML;
      const parts = html.split(/<br\s*\/?>\s*/);

      if (parts.length > 2) {
        // Title: first line (bold heading)
        const title = document.createElement('p');
        title.className = 'promo-card-title';
        title.innerHTML = parts[0].trim();
        textWrapper.append(title);

        // Preview: second line
        const preview = document.createElement('p');
        preview.className = 'promo-card-preview';
        preview.innerHTML = parts[1].trim();
        textWrapper.append(preview);

        // Collapsible: remaining lines
        const collapsible = document.createElement('div');
        collapsible.className = 'promo-card-collapsible';
        parts.slice(2).forEach((part) => {
          const trimmed = part.trim();
          if (trimmed) {
            const line = document.createElement('p');
            line.innerHTML = trimmed;
            collapsible.append(line);
          }
        });
        textWrapper.append(collapsible);

        // Toggle button
        const toggle = document.createElement('button');
        toggle.className = 'promo-card-toggle';
        toggle.innerHTML = 'Ver más <span class="promo-card-chevron"></span>';
        toggle.addEventListener('click', () => {
          const isOpen = collapsible.classList.toggle('open');
          toggle.innerHTML = isOpen
            ? 'Ver menos <span class="promo-card-chevron open"></span>'
            : 'Ver más <span class="promo-card-chevron"></span>';
        });
        textWrapper.append(toggle);
      } else {
        // Simple case: just append all content
        textWrapper.append(...textCol.childNodes);
      }

      card.append(textWrapper);
    }

    block.append(card);
  });
}
