export class Modal {
  constructor(options = {}) {
    this.title = options.title || 'Modal Title';
    this.content = options.content || '';
    this.closeOnClickOutside = options.closeOnClickOutside ?? true;
    this.element = null;
    this.overlay = null;
    this.isOpen = false;
  }

  create() {
    // Create modal overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';

    // Create modal container
    this.element = document.createElement('div');
    this.element.className = 'modal';
    
    this.element.innerHTML = `
      <div class="modal-header">
        <h2>${this.title}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-content">
        ${this.content}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-cancel">Cancel</button>
        <button class="btn btn-primary modal-confirm">Confirm</button>
      </div>
    `;

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    // Close button click
    this.element.querySelector('.modal-close').addEventListener('click', () => this.close());
    
    // Cancel button click
    this.element.querySelector('.modal-cancel').addEventListener('click', () => this.close());
    
    // Confirm button click
    this.element.querySelector('.modal-confirm').addEventListener('click', () => {
      this.confirm();
      this.close();
    });

    // Click outside modal
    if (this.closeOnClickOutside) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  open() {
    if (!this.element) {
      this.create();
    }
    
    document.body.appendChild(this.overlay);
    this.overlay.appendChild(this.element);
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.isOpen) {
      this.overlay.remove();
      this.isOpen = false;
      document.body.style.overflow = '';
    }
  }

  confirm() {
    // Override this method to handle confirmation
    console.log('Modal confirmed');
  }

  setContent(content) {
    this.content = content;
    if (this.element) {
      this.element.querySelector('.modal-content').innerHTML = content;
    }
  }

  setTitle(title) {
    this.title = title;
    if (this.element) {
      this.element.querySelector('.modal-header h2').textContent = title;
    }
  }
} 