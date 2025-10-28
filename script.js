// Enhanced Hotel Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initBookingSystem();
    initTestimonialSlider();
    initNewsletter();
    initAnimations();
    initModalSystem();
});

// Navigation System
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '☰';
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition - 80; // Offset for fixed navbar
                
                let startTime = null;
                
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, 1000);
                    window.scrollTo(0, run);
                    if (timeElapsed < 1000) requestAnimationFrame(animation);
                }
                
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}

// Booking System
function initBookingSystem() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    // Initialize booking steps
    initBookingSteps();
    
    // Initialize guest management
    initGuestManagement();
    
    // Initialize price calculation
    initPriceCalculation();
    
    // Form submission
    bookingForm.addEventListener('submit', handleBookingSubmission);
}

function initBookingSteps() {
    const steps = document.querySelectorAll('.step');
    let currentStep = 1;

    // Show first step
    showStep(currentStep);

    // Room type selection
    const roomType = document.getElementById('roomType');
    if (roomType) {
        roomType.addEventListener('change', function() {
            if (this.value) {
                showStep(2);
                updateProgress(2);
                calculateTotalPrice();
            }
        });
    }

    // Amenities selection
    document.querySelectorAll('input[name="amenities"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedAmenities = document.querySelectorAll('input[name="amenities"]:checked');
            if (checkedAmenities.length > 0) {
                showStep(3);
                updateProgress(3);
            }
            calculateTotalPrice();
        });
    });

    // Date selection
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    
    if (checkIn && checkOut) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        checkIn.min = today;
        
        checkIn.addEventListener('change', function() {
            if (this.value) {
                checkOut.min = this.value;
                validateDates();
            }
        });
        
        checkOut.addEventListener('change', validateDates);
    }

    // Guest information
    const guestName = document.getElementById('guestName1');
    if (guestName) {
        guestName.addEventListener('input', function() {
            if (this.value.trim()) {
                showStep(5);
                updateProgress(5);
            }
        });
    }

    // Contact information
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    if (email && phone) {
        email.addEventListener('input', validateContact);
        phone.addEventListener('input', validateContact);
    }
}

function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    
    const currentStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
    if (currentStep) {
        currentStep.style.display = 'block';
        currentStep.style.animation = 'fadeInUp 0.5s ease';
    }
}

function updateProgress(stepNumber) {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function initGuestManagement() {
    let guestCount = 1;
    const addGuestBtn = document.getElementById('addGuestBtn');
    const guestNamesContainer = document.getElementById('guestNamesContainer');

    if (addGuestBtn && guestNamesContainer) {
        addGuestBtn.addEventListener('click', function() {
            if (guestCount < 6) { // Limit to 6 guests
                guestCount++;
                addGuestField(guestCount);
            } else {
                showNotification('Maximum 6 guests allowed', 'warning');
            }
        });
    }
}

function addGuestField(guestNumber) {
    const guestNamesContainer = document.getElementById('guestNamesContainer');
    
    const newLabelRow = document.createElement('div');
    newLabelRow.className = 'guest-label-row';

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `guestName${guestNumber}`);
    newLabel.textContent = `Guest ${guestNumber} Name:`;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function() {
        const row = this.closest('.guest-label-row');
        const input = row.nextElementSibling;
        if (input && input.tagName === 'INPUT') {
            guestNamesContainer.removeChild(input);
        }
        guestNamesContainer.removeChild(row);
        guestCount--;
        calculateTotalPrice();
    });

    newLabelRow.appendChild(newLabel);
    newLabelRow.appendChild(removeBtn);

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = `guestName${guestNumber}`;
    newInput.name = 'guestName[]';
    newInput.required = true;
    newInput.placeholder = `Enter guest ${guestNumber} name`;

    guestNamesContainer.appendChild(newLabelRow);
    guestNamesContainer.appendChild(newInput);
    
    // Add animation
    newLabelRow.style.animation = 'fadeInUp 0.3s ease';
    newInput.style.animation = 'fadeInUp 0.3s ease';
}

// Price Calculation
const amenityPrices = {
    'Free Wi-Fi': 20,
    'Swimming Pool': 50,
    'Buffet': 100,
    'Gym': 30,
    'Spa': 150
};

const roomPrices = {
    'Standard Room': 150,
    'Deluxe Room': 250,
    'Suite': 400,
    'Family Room': 300
};

function initPriceCalculation() {
    // Add event listeners for price calculation
    document.getElementById('roomType')?.addEventListener('change', calculateTotalPrice);
    document.querySelectorAll('input[name="amenities"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotalPrice);
    });
    
    calculateTotalPrice(); // Initial calculation
}

function calculateTotalPrice() {
    const roomSelect = document.getElementById('roomType');
    const selectedOption = roomSelect?.options[roomSelect.selectedIndex];
    let total = 0;
    
    // Room price
    if (selectedOption?.value && roomPrices[selectedOption.value]) {
        total = roomPrices[selectedOption.value];
    }
    
    // Amenities prices
    const checkedAmenities = document.querySelectorAll('input[name="amenities"]:checked');
    checkedAmenities.forEach(checkbox => {
        total += amenityPrices[checkbox.value] || 0;
    });
    
    // Update display
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `Total Price: AED ${total}/night`;
        totalPriceElement.style.animation = 'pulse 0.5s ease';
    }
    
    return total;
}

// Form Validation
function validateDates() {
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    
    if (checkIn.value && checkOut.value) {
        const checkInDate = new Date(checkIn.value);
        const checkOutDate = new Date(checkOut.value);
        
        if (checkOutDate <= checkInDate) {
            showNotification('Check-out date must be after check-in date', 'error');
            checkOut.value = '';
        } else {
            showStep(4);
            updateProgress(4);
        }
    }
}

function validateContact() {
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    if (email.value && phone.value) {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Basic phone validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone.value)) {
            showNotification('Please enter a valid phone number', 'error');
            return;
        }
        
        showStep(6);
        updateProgress(6);
    }
}

// Form Submission
function handleBookingSubmission(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<div class="loading"></div> Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Collect form data
        const formData = new FormData(e.target);
        const bookingData = {};
        
        for (let [key, value] of formData.entries()) {
            if (bookingData[key]) {
                if (Array.isArray(bookingData[key])) {
                    bookingData[key].push(value);
                } else {
                    bookingData[key] = [bookingData[key], value];
                }
            } else {
                bookingData[key] = value;
            }
        }
        
        // Save to localStorage
        localStorage.setItem('lastBooking', JSON.stringify(bookingData));
        
        // Show success message
        showBookingSuccess(bookingData);
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
    }, 2000);
}

function showBookingSuccess(bookingData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center;">
            <span class="close">&times;</span>
            <div class="success-checkmark">
                <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                    <div class="icon-circle"></div>
                    <div class="icon-fix"></div>
                </div>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Thank you, ${bookingData['guestName[]'][0]}! Your booking has been successfully submitted.</p>
            <p>We've sent a confirmation email to ${bookingData.email}</p>
            <div style="margin-top: 2rem;">
                <button class="cta-button" onclick="this.closest('.modal').remove()">Continue</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
    
    // Auto-scroll testimonials
    setInterval(() => {
        if (slider && !isDown) {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            if (slider.scrollLeft >= maxScroll) {
                slider.scrollLeft = 0;
            } else {
                slider.scrollLeft += 300;
            }
        }
    }, 5000);
}

// Newsletter Subscription
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Simulate subscription
        this.innerHTML = '<p style="color: white; margin: 0;">Thank you for subscribing!</p>';
        
        // Save subscription
        localStorage.setItem('newsletterSubscribed', 'true');
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.room-card, .amenity-card, .testimonial-card').forEach(el => {
        el.style.animation = 'fadeInUp 0.6s ease forwards';
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Create floating elements in hero
    createFloatingElements();
}

function createFloatingElements() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${left}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.animationDuration = `${animationDuration}s`;
        element.style.animationDelay = `${animationDelay}s`;
        element.style.opacity = Math.random() * 0.3 + 0.1;
        
        floatingContainer.appendChild(element);
    }
    
    hero.appendChild(floatingContainer);
}

// Modal System
function initModalSystem() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 3000;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #3498db;
            }
            .notification-error { border-left-color: #e74c3c; }
            .notification-warning { border-left-color: #f39c12; }
            .notification-success { border-left-color: #27ae60; }
            .notification button {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #666;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const contactData = {};
        
        for (let [key, value] of formData.entries()) {
            contactData[key] = value;
        }
        
        // Show success message
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // Save contact inquiry
        const inquiries = JSON.parse(localStorage.getItem('contactInquiries') || '[]');
        inquiries.push({
            ...contactData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactInquiries', JSON.stringify(inquiries));
    });
}

// Auto-resize textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    messageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// Language Switcher (placeholder)
document.getElementById('languageBtn')?.addEventListener('click', function() {
    showNotification('Language switching feature coming soon!', 'info');
});

// Export functions for global access
window.calculateTotalPrice = calculateTotalPrice;
window.showNotification = showNotification;