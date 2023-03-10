export class Card {
  constructor(title, content, imageUrl = '') {
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.element = this.create();
  }

  create() {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
      ${this.imageUrl ? `<img src="${this.imageUrl}" alt="${this.title}" class="card-image">` : ''}
      <div class="card-content">
        <h3 class="card-title">${this.title}</h3>
        <p class="card-text">${this.content}</p>
        <button class="btn card-btn">Learn More</button>
      </div>
    `;

    card.querySelector('.card-btn')?.addEventListener('click', () => {
      this.handleClick();
    });

    return card;
  }

  handleClick() {
    console.log(`Card clicked: ${this.title}`);
    // Custom click handling can be added here
  }

  mount(parent) {
    parent.appendChild(this.element);
  }

  unmount() {
    this.element.remove();
  }
} 