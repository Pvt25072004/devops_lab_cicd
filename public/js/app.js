// Books CRUD App - Client-side JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize delete functionality
    initializeDeleteButtons();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Auto-dismiss alerts after 5 seconds
    autoHideAlerts();
    
    // Initialize card animations
    initializeCardAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

/**
 * Initialize card hover animations and interactions
 */
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.book-card');
    
    cards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-6px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize delete button functionality with enhanced animations
 */
function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const deleteModalElement = document.getElementById('deleteModal');
    
    if (!deleteModalElement) return;
    
    const deleteModal = new bootstrap.Modal(deleteModalElement);
    const deleteForm = document.getElementById('deleteForm');
    const bookTitleSpan = document.getElementById('bookTitle');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click events
            
            const bookId = this.dataset.bookId;
            const bookTitle = this.dataset.bookTitle;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Update modal content
            if (bookTitleSpan) {
                bookTitleSpan.textContent = bookTitle;
            }
            if (deleteForm) {
                deleteForm.action = `/books/${bookId}?_method=DELETE`;
            }
            
            // Show modal with slight delay for better UX
            setTimeout(() => {
                deleteModal.show();
            }, 200);
        });
    });
    
    // Add loading state to delete form submission
    if (deleteForm) {
        deleteForm.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Deleting...';
            }
        });
    }
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Show loading state on submit button
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    const originalText = submitButton.innerHTML;
                    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Processing...';
                    
                    // Re-enable after 5 seconds as fallback
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;
                    }, 5000);
                }
            }
            
            form.classList.add('was-validated');
        });
    });
    
    // Real-time validation for required fields
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim() !== '') {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            }
        });
    });
}

/**
 * Auto-hide alerts after 5 seconds
 */
function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

/**
 * Utility function to show toast notifications
 */
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * Confirm navigation away from unsaved form
 */
function setupFormChangeDetection() {
    const forms = document.querySelectorAll('form');
    let formChanged = false;
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                formChanged = true;
            });
        });
        
        form.addEventListener('submit', () => {
            formChanged = false;
        });
    });
    
    window.addEventListener('beforeunload', (event) => {
        if (formChanged) {
            event.preventDefault();
            event.returnValue = '';
        }
    });
}

// Initialize form change detection
setupFormChangeDetection();
