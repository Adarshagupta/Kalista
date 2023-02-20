export class Footer {
  constructor() {
    this.init();
  }

  init() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    const currentYear = new Date().getFullYear();
    
    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Us</h3>
            <p>Building the future of web applications with modern technologies.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Connect</h3>
            <div class="social-links">
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">LinkedIn</a>
              <a href="#" class="social-link">GitHub</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${currentYear} Khalista. All rights reserved.</p>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }
} 