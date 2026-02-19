export default function decorate(block) {
  const options = [];
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const label = cols[0]?.textContent.trim();
    const cards = cols.slice(1).map((c) => c.innerHTML.trim()).filter(Boolean);
    options.push({ label, cards });
  });

  block.textContent = '';

  // Create tab buttons
  const tabBar = document.createElement('div');
  tabBar.className = 'payment-options-tabs';

  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'payment-options-tab';
    if (idx === 0) btn.classList.add('active');
    btn.textContent = opt.label;
    btn.setAttribute('data-tab', idx);
    tabBar.append(btn);
  });

  block.append(tabBar);

  // Create panels
  options.forEach((opt, idx) => {
    const panel = document.createElement('div');
    panel.className = 'payment-options-panel';
    if (idx === 0) panel.classList.add('active');
    panel.setAttribute('data-panel', idx);

    // If panel has multiple cards, add term toggle buttons
    if (opt.cards.length > 1) {
      const termBar = document.createElement('div');
      termBar.className = 'payment-options-terms';

      opt.cards.forEach((html, cardIdx) => {
        const termBtn = document.createElement('button');
        termBtn.className = 'payment-options-term';
        // Default: last card (longest term) is active
        if (cardIdx === opt.cards.length - 1) termBtn.classList.add('active');
        // Label: "En 24 meses" / "En 36 meses" based on card position
        const months = cardIdx === 0 ? '24' : '36';
        termBtn.textContent = `En ${months} meses`;
        termBtn.setAttribute('data-term', cardIdx);
        termBar.append(termBtn);
      });

      panel.append(termBar);

      // Term click handling
      termBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.payment-options-term');
        if (!btn) return;
        const termIdx = btn.getAttribute('data-term');

        termBar.querySelectorAll('.payment-options-term').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        panel.querySelectorAll('.payment-options-card').forEach((c) => {
          c.classList.toggle('active', c.getAttribute('data-term') === termIdx);
        });
      });
    }

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'payment-options-cards';

    opt.cards.forEach((html, cardIdx) => {
      const card = document.createElement('div');
      card.className = 'payment-options-card';
      card.innerHTML = html;
      card.setAttribute('data-term', cardIdx);
      // If multiple cards, only show the last one (longest term) by default
      if (opt.cards.length > 1) {
        if (cardIdx === opt.cards.length - 1) card.classList.add('active');
      } else {
        card.classList.add('active');
      }
      cardsContainer.append(card);
    });

    panel.append(cardsContainer);
    block.append(panel);
  });

  // Tab click handling
  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.payment-options-tab');
    if (!btn) return;
    const tabIdx = btn.getAttribute('data-tab');

    tabBar.querySelectorAll('.payment-options-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    block.querySelectorAll('.payment-options-panel').forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-panel') === tabIdx);
    });
  });
}
