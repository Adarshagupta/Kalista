export class Form {
  constructor(options = {}) {
    this.fields = options.fields || [];
    this.onSubmit = options.onSubmit || (() => {});
    this.element = this.create();
  }

  create() {
    const form = document.createElement('form');
    form.className = 'form';
    
    // Create form fields
    const fieldsHtml = this.fields.map(field => `
      <div class="form-group">
        <label for="${field.id}">${field.label}</label>
        <input 
          type="${field.type || 'text'}"
          id="${field.id}"
          name="${field.id}"
          placeholder="${field.placeholder || ''}"
          ${field.required ? 'required' : ''}
          class="form-control"
        >
        <span class="error-message"></span>
      </div>
    `).join('');

    form.innerHTML = `
      ${fieldsHtml}
      <div class="form-group">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    `;

    // Add event listeners
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    form.addEventListener('input', (e) => this.handleInput(e));

    return form;
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (this.validateForm()) {
      this.onSubmit(data);
    }
  }

  handleInput(e) {
    const field = e.target;
    this.validateField(field);
  }

  validateField(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';

    if (field.required && !field.value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email';
    }

    errorElement.textContent = errorMessage;
    return isValid;
  }

  validateForm() {
    const inputs = this.element.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  mount(parent) {
    parent.appendChild(this.element);
  }

  unmount() {
    this.element.remove();
  }
} 