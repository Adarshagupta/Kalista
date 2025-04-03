// Cyberpunk effects for the website

// Create floating particles
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    // Number of particles based on screen size
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `${Math.random() * 20}%`;
        
        // Random animation duration between 10s and 20s
        const duration = Math.random() * 10 + 10;
        particle.style.setProperty('--duration', `${duration}s`);
        
        // Random travel distance between 100vh and 120vh
        const travel = Math.random() * 20 + 100;
        particle.style.setProperty('--travel-distance', `${travel}vh`);
        
        // Random rotation between 0 and 360 degrees
        const rotation = Math.random() * 360;
        particle.style.setProperty('--rotation', `${rotation}deg`);
        
        // Random opacity between 0.2 and 0.6
        const opacity = Math.random() * 0.4 + 0.2;
        particle.style.setProperty('--opacity', opacity);
        
        // Add to container
        container.appendChild(particle);
    }
}

// Update data-corruption element when text changes
function updateDataCorruption() {
    const cyclingText = document.querySelector('.cycling-text');
    const dataCorruption = document.querySelector('.data-corruption');
    
    if (cyclingText && dataCorruption) {
        // Update data-text attribute when cycling text changes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-text') {
                    dataCorruption.setAttribute('data-text', cyclingText.getAttribute('data-text'));
                } else if (mutation.type === 'childList') {
                    dataCorruption.setAttribute('data-text', cyclingText.textContent);
                }
            });
        });
        
        observer.observe(cyclingText, { 
            attributes: true, 
            childList: true,
            attributeFilter: ['data-text'] 
        });
    }
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    updateDataCorruption();
    
    // Recreate particles on window resize
    window.addEventListener('resize', createParticles);
});
