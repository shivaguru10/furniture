const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const LoadingState = ({
  label = 'Loading furniture...',
  sublabel = 'Preparing the room for you',
  variant = 'page',
} = {}) => `
  <div class="loading-state loading-state--${escapeHtml(variant)}" role="status" aria-live="polite">
    <div class="loading-furniture" aria-hidden="true">
      <span class="loading-furniture__seat"></span>
      <span class="loading-furniture__back"></span>
      <span class="loading-furniture__leg loading-furniture__leg--left"></span>
      <span class="loading-furniture__leg loading-furniture__leg--right"></span>
      <span class="loading-furniture__spark loading-furniture__spark--one"></span>
      <span class="loading-furniture__spark loading-furniture__spark--two"></span>
    </div>
    <p class="loading-state__label">${escapeHtml(label)}</p>
    ${sublabel ? `<p class="loading-state__sublabel">${escapeHtml(sublabel)}</p>` : ''}
  </div>
`;
