export class Header {
  constructor() {
    this.init();
  }

  init() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container">
        <nav class="main-nav">
          <a href="/" class="logo">Khalista</a>
          <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    `;
    document.body.prepend(header);
  }
} 