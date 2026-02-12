const AUTOPLAY_INTERVAL = 6000;

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-promo');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-promo-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-promo-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
      indicator.querySelector('button').classList.remove('active');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
      indicator.querySelector('button').classList.add('active');
    }
  });

  // Restart progress animation on active indicator
  const activeBtn = indicators[slideIndex]?.querySelector('button');
  if (activeBtn) {
    const progressBar = activeBtn.querySelector('.progress-bar');
    if (progressBar && block.dataset.autoplay === 'true') {
      progressBar.style.animation = 'none';
      // eslint-disable-next-line no-void
      void progressBar.offsetWidth;
      progressBar.style.animation = '';
    }
  }
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-promo-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-promo-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function startAutoplay(block) {
  block.dataset.autoplay = 'true';
  const playBtn = block.querySelector('.carousel-promo-autoplay');
  if (playBtn) playBtn.classList.add('playing');

  // Enable progress bar animation on current active indicator
  const activeIndicator = block.querySelector('.carousel-promo-slide-indicator button.active .progress-bar');
  if (activeIndicator) {
    activeIndicator.style.animation = 'none';
    // eslint-disable-next-line no-void
    void activeIndicator.offsetWidth;
    activeIndicator.style.animation = '';
  }

  if (block.autoplayTimer) clearInterval(block.autoplayTimer);
  block.autoplayTimer = setInterval(() => {
    const current = parseInt(block.dataset.activeSlide, 10);
    showSlide(block, current + 1);
  }, AUTOPLAY_INTERVAL);
}

function stopAutoplay(block) {
  block.dataset.autoplay = 'false';
  const playBtn = block.querySelector('.carousel-promo-autoplay');
  if (playBtn) playBtn.classList.remove('playing');

  if (block.autoplayTimer) {
    clearInterval(block.autoplayTimer);
    block.autoplayTimer = null;
  }

  // Reset progress bar animations
  block.querySelectorAll('.carousel-promo-slide-indicator .progress-bar').forEach((bar) => {
    bar.style.animation = 'none';
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-promo-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
      if (block.dataset.autoplay === 'true') {
        startAutoplay(block); // restart timer
      }
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    if (block.dataset.autoplay === 'true') {
      startAutoplay(block);
    }
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    if (block.dataset.autoplay === 'true') {
      startAutoplay(block);
    }
  });

  // Play/pause button
  const playBtn = block.querySelector('.carousel-promo-autoplay');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (block.dataset.autoplay === 'true') {
        stopAutoplay(block);
      } else {
        startAutoplay(block);
      }
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-promo-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-promo-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-promo-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    if (colIdx === 1) {
      const firstP = column.querySelector('p:first-child');
      if (firstP && firstP.textContent.trim().toLowerCase() === 'light') {
        slide.classList.add('carousel-promo-slide-light');
        firstP.remove();
      }
    }
    column.classList.add(`carousel-promo-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

/* eslint-disable max-len */
const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.666 11.667c0 .367-.3.666-.667.666H9.666a.667.667 0 0 1-.667-.666V4.333c0-.367.3-.667.667-.667h2v8Z" fill="white" stroke="white" stroke-linecap="round"/><path d="M7 11.667c0 .367-.3.666-.667.666H5a.667.667 0 0 1-.667-.666V4.333c0-.367.3-.667.667-.667h2v8Z" fill="white" stroke="white" stroke-linecap="round"/></svg>';
const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.667 3.333v9.334L12.667 8z" fill="white" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* eslint-enable max-len */

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-promo-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-promo-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-promo-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    // Animation menu: indicators + play button overlaid on the slide
    const animationMenu = document.createElement('div');
    animationMenu.classList.add('carousel-promo-animation-menu');

    const indicatorsWrapper = document.createElement('div');
    indicatorsWrapper.classList.add('carousel-promo-animated');

    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-promo-slide-indicators');
    indicatorsWrapper.append(slideIndicators);
    animationMenu.append(indicatorsWrapper);

    // Play/pause button
    const autoplayBtn = document.createElement('button');
    autoplayBtn.type = 'button';
    autoplayBtn.classList.add('carousel-promo-autoplay');
    autoplayBtn.setAttribute('aria-label', 'Play/Pause Carousel');
    autoplayBtn.innerHTML = pauseIcon;
    animationMenu.append(autoplayBtn);

    container.append(animationMenu);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-promo-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;

    container.append(slideNavButtons);

    // Toggle icon on play/pause
    autoplayBtn.addEventListener('click', () => {
      if (block.dataset.autoplay === 'true') {
        autoplayBtn.innerHTML = playIcon;
      } else {
        autoplayBtn.innerHTML = pauseIcon;
      }
    });
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-promo-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="Show Slide ${idx + 1} of ${rows.length}"><div class="progress-bar"></div></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
    startAutoplay(block);
  }
}
