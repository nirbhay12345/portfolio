// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target){
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Intersection Observer for elegant fade-up animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Add CSS for fade-in elements dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      .fade-up {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
    
    // Apply fade-up to premium elements
    const elementsToAnimate = document.querySelectorAll('.glass-card, .section-title');
    elementsToAnimate.forEach((el, index) => {
      el.classList.add('fade-up');
      // Add slight staggered delay based on index for grid elements
      if (el.classList.contains('skill-category') || el.classList.contains('project-card')) {
          el.style.transitionDelay = \`\${(index % 4) * 0.1}s\`;
      }
      observer.observe(el);
    });
});
