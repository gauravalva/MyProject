// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections for animation
    const animatedElements = document.querySelectorAll(
        '.testimonial-card, .detail-item, .award-item, .highlight-item, .affiliation-item'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add click tracking for buttons (for analytics if needed later)
    const ctaButtons = document.querySelectorAll('.cta-button, .social-link');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add a subtle click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track button clicks (placeholder for future analytics)
            const buttonText = this.textContent.trim() || this.getAttribute('aria-label') || 'Social Link';
            console.log(`Button clicked: ${buttonText}`);
        });
    });
    
    // Add hover effect to profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) contrast(1.05)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    }
    
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add testimonial card rotation effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Add subtle rotation based on card position
            const rotation = (index % 2 === 0) ? '2deg' : '-2deg';
            this.style.transform = `translateY(-10px) rotate(${rotation})`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Add typing effect to hero headline (subtle)
    const headline = document.querySelector('.hero-headline');
    if (headline) {
        const originalText = headline.textContent;
        headline.textContent = '';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            headline.textContent += originalText.charAt(i);
            i++;
            if (i >= originalText.length) {
                clearInterval(typingEffect);
            }
        }, 100);
    }
    
    // Add floating animation to award icons
    const awardIcons = document.querySelectorAll('.award-icon i');
    awardIcons.forEach(icon => {
        icon.style.animation = 'float 3s ease-in-out infinite';
        icon.style.animationDelay = Math.random() * 2 + 's';
    });
    
    // Add stagger animation to affiliation items
    const affiliationItems = document.querySelectorAll('.affiliation-item');
    affiliationItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add number counter animation for highlights
    const highlightNumbers = document.querySelectorAll('.highlight-number');
    const numberObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent.replace('+', ''));
                let current = 0;
                const increment = finalNumber / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        current = finalNumber;
                        clearInterval(timer);
                    }
                    target.textContent = Math.floor(current) + (target.textContent.includes('+') ? '+' : '');
                }, 30);
                numberObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    highlightNumbers.forEach(number => {
        numberObserver.observe(number);
    });
    
    // Add mobile menu functionality (if needed for future expansion)
    const handleMobileInteraction = () => {
        if (window.innerWidth <= 768) {
            // Adjust button sizes for better mobile interaction
            const buttons = document.querySelectorAll('.cta-button');
            buttons.forEach(button => {
                button.style.minHeight = '50px';
                button.style.fontSize = '1rem';
            });
        }
    };
    
    window.addEventListener('resize', handleMobileInteraction);
    handleMobileInteraction(); // Call on load
    
    // Add accessibility improvements
    const addAccessibilityFeatures = () => {
        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '3px solid #3b82f6';
                this.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
        
        // Add aria-labels for social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            if (link.classList.contains('instagram')) {
                link.setAttribute('aria-label', 'Follow Dr. Rakshith Shetty on Instagram');
            } else if (link.classList.contains('linkedin')) {
                link.setAttribute('aria-label', 'Connect with Dr. Rakshith Shetty on LinkedIn');
            }
        });
    };
    
    addAccessibilityFeatures();
    
    // Add loading state for external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add loading indicator
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
    
    console.log('Dr. Rakshith Shetty\'s website loaded successfully!');
});