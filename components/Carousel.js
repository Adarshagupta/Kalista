export class Carousel {
  constructor(options = {}) {
    this.slides = options.slides || [];
    this.autoPlay = options.autoPlay ?? true;
    this.interval = options.interval || 5000;
    this.currentIndex = 0;
    this.element = null;
    this.autoPlayTimer = null;
    this.init();
  }

  init() {
    this.element = this.create();
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  create() {
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    
    // Create slides container
    const slidesHtml = this.slides.map((slide, index) => `
      <div class="carousel-slide ${index === 0 ? 'active' : ''}">
        <img src="${slide.image}" alt="${slide.alt || ''}" class="carousel-image">
        ${slide.caption ? `<div class="carousel-caption">${slide.caption}</div>` : ''}
      </div>
    `).join('');

    // Create navigation dots
    const dotsHtml = this.slides.map((_, index) => `
      <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
    `).join('');

    carousel.innerHTML = `
      <div class="carousel-container">
        ${slidesHtml}
        <button class="carousel-control prev">&lt;</button>
        <button class="carousel-control next">&gt;</button>
        <div class="carousel-dots">
          ${dotsHtml}
        </div>
      </div>
    `;

    // Add event listeners
    this.addEventListeners(carousel);

    return carousel;
  }

  addEventListeners(carousel) {
    // Previous button click
    carousel.querySelector('.prev').addEventListener('click', () => this.prev());
    
    // Next button click
    carousel.querySelector('.next').addEventListener('click', () => this.next());
    
    // Dot navigation
    carousel.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        this.goToSlide(index);
      });
    });

    // Pause autoplay on hover
    if (this.autoPlay) {
      carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
      carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }

  next() {
    this.goToSlide((this.currentIndex + 1) % this.slides.length);
  }

  prev() {
    this.goToSlide((this.currentIndex - 1 + this.slides.length) % this.slides.length);
  }

  goToSlide(index) {
    // Remove active class from current slide and dot
    this.element.querySelector('.carousel-slide.active').classList.remove('active');
    this.element.querySelector('.carousel-dot.active').classList.remove('active');

    // Add active class to new slide and dot
    this.element.querySelectorAll('.carousel-slide')[index].classList.add('active');
    this.element.querySelectorAll('.carousel-dot')[index].classList.add('active');

    this.currentIndex = index;
  }

  startAutoPlay() {
    if (this.autoPlayTimer) return;
    this.autoPlayTimer = setInterval(() => this.next(), this.interval);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  mount(parent) {
    parent.appendChild(this.element);
  }

  unmount() {
    this.stopAutoPlay();
    this.element.remove();
  }
} 