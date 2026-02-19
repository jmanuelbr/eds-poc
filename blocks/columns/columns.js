export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Steps variant: add timeline dots
  if (block.classList.contains('steps')) {
    [...block.children].forEach((row) => {
      [...row.children].forEach((col) => {
        const dot = document.createElement('div');
        dot.className = 'steps-dot';
        col.append(dot);
      });
    });
  }
}
