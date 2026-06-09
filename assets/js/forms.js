// Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

// Form Validation
function validateForm(formData) {
    const errors = [];

    // Name validation
    if (!formData.name || formData.name.trim().length < 3) {
        errors.push('Ad en az 3 karakter olmalıdır');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Geçerli bir e-mail adresi girin');
    }

    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Mesaj en az 10 karakter olmalıdır');
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && formData.phone.trim()) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(formData.phone)) {
            errors.push('Geçerli bir telefon numarası girin');
        }
    }

    return errors;
}

// Form Submission Handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Validate form
    const errors = validateForm(formData);

    if (errors.length > 0) {
        formNote.style.color = '#FF6B6B';
        formNote.textContent = '❌ ' + errors.join(', ');
        formNote.style.display = 'block';
        return;
    }

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Gönderiliyor...';
    submitButton.disabled = true;

    try {
        // Simulate form submission (replace with actual backend endpoint)
        await simulateFormSubmission(formData);

        // Show success message
        formNote.style.color = '#4ECDC4';
        formNote.textContent = '✅ Mesajınız başarıyla gönderildi! En kısa zamanda sizinle iletişime geçeceğiz.';
        formNote.style.display = 'block';

        // Reset form
        contactForm.reset();

        // Reset button
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 3000);

        // Clear message after 5 seconds
        setTimeout(() => {
            formNote.style.display = 'none';
        }, 5000);

    } catch (error) {
        formNote.style.color = '#FF6B6B';
        formNote.textContent = '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        formNote.style.display = 'block';

        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Simulate form submission (mock backend)
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            const isSuccess = Math.random() > 0.1; // 90% success rate

            if (isSuccess) {
                // Here you would normally send data to backend
                console.log('Form Data:', formData);
                
                // Log to localStorage for demo purposes
                const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
                submissions.push({
                    ...formData,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('formSubmissions', JSON.stringify(submissions));

                resolve(formData);
            } else {
                reject(new Error('Submission failed'));
            }
        }, 1500);
    });
}

// Email Pattern for Real-time Validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#FF6B6B';
        } else {
            emailInput.style.borderColor = '#4ECDC4';
        }
    });
}

// Character Counter for Message
const messageInput = document.getElementById('message');
if (messageInput) {
    messageInput.addEventListener('input', () => {
        const charCount = messageInput.value.length;
        if (charCount < 10) {
            messageInput.style.borderColor = '#FFE66D';
        } else {
            messageInput.style.borderColor = '#4ECDC4';
        }
    });
}

// Input Focus Effects
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Form Autofill Detection
document.querySelectorAll('.form-group input').forEach(input => {
    const style = window.getComputedStyle(input, ':-webkit-autofill');
    if (style) {
        input.addEventListener('input', function() {
            if (this.matches(':-webkit-autofill')) {
                this.style.WebkitBoxShadow = '0 0 0 1000px white inset';
            }
        });
    }
});

// Pricing Plan Selection
document.querySelectorAll('.pricing-card .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const card = this.closest('.pricing-card');
        const planName = card.querySelector('h3').textContent;
        const price = card.querySelector('.price span').textContent;
        
        // Populate form with plan info
        const messageInput = document.getElementById('message');
        messageInput.value = `Merhaba, ${planName} (₺${price}) paketinden ilgiliyim. `;
        
        // Scroll to form
        messageInput.focus();
        messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// Phone Input Formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            } else if (value.length <= 9) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            } else {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
            }
        }
        
        e.target.value = value;
    });
}

// Form Data Persistence
window.addEventListener('beforeunload', () => {
    if (contactForm && contactForm.querySelector('input[type="text"]').value) {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
        sessionStorage.setItem('formDraft', JSON.stringify(formData));
    }
});

window.addEventListener('load', () => {
    const savedFormData = sessionStorage.getItem('formDraft');
    if (savedFormData && !document.getElementById('name').value) {
        const formData = JSON.parse(savedFormData);
        document.getElementById('name').value = formData.name;
        document.getElementById('email').value = formData.email;
        document.getElementById('phone').value = formData.phone;
        document.getElementById('message').value = formData.message;
    }
});

console.log('📧 Form sistemi aktif!');
