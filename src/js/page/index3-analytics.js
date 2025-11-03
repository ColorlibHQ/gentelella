// Sales Analytics Widget Initialization

// Get security utilities from window if available
const sanitizeHtml =
  window.sanitizeHtml ||
  function (html) {
    return html;
  };

function initSalesAnalytics() {
  // Animate progress bars on page load
  const progressBars = document.querySelectorAll('.sales-progress .progress-bar');

  if (progressBars.length > 0) {
    // Reset all progress bars to 0 width initially
    progressBars.forEach(bar => {
      bar.style.width = '0%';
    });

    // Animate them to their target width with a staggered delay
    setTimeout(() => {
      progressBars.forEach((bar, index) => {
        setTimeout(() => {
          const targetWidth =
            bar.style.getPropertyValue('--final-width') || bar.getAttribute('data-width');
          if (targetWidth) {
            bar.style.width = targetWidth;
          } else {
            // Fallback to reading from parent element's data or style
            const parentProgress = bar.closest('.progress');
            if (parentProgress) {
              const widthMatch = bar.className.match(/width:\s*(\d+)%/);
              if (widthMatch) {
                bar.style.width = widthMatch[1] + '%';
              }
            }
          }
        }, index * 150); // Stagger animation by 150ms per bar
      });
    }, 500); // Initial delay to ensure page is loaded
  }

  // Add hover effects to the View Details button
  const viewDetailsBtn = document
    .querySelector('.sales-progress')
    .closest('.card')
    .querySelector('.btn-outline-success');
  if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // Simple animation feedback
      this.innerHTML = sanitizeHtml('<i class="fas fa-spinner fa-spin me-1"></i>Loading...');

      setTimeout(() => {
        this.innerHTML = sanitizeHtml('View Details');
        // Here you could open a modal or navigate to details page
        alert('Sales details would be displayed here');
      }, 1000);
    });
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Small delay to ensure styles are loaded
  setTimeout(initSalesAnalytics, 200);
});
