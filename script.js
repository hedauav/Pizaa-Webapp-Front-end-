

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.getElementById('backToTop');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuItems = document.querySelectorAll('.menu-item');
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const testimonialDots = document.getElementById('testimonialDots').querySelectorAll('.dot');
    
    // Current date display
    const currentDateDisplay = document.querySelector('.footer-bottom p:last-child');
    const currentDate = new Date();
    const formattedDate = `Last Updated: ${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    if (currentDateDisplay) {
        currentDateDisplay.textContent = `Designed by Anish-07 | ${formattedDate}`;
    }

    // Variables
    let currentTestimonial = 0;
    const testimonialCount = testimonialDots.length;
    
    // ===== Fixed Navigation Menu =====
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Show/hide back to top button
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
        
        // Active link based on scroll position
        updateActiveNavOnScroll();
    });
    
    // Initial check in case the page is refreshed or enters at a scroll position
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    }
    
    if (window.scrollY > 500) {
        backToTopButton.classList.add('visible');
    }
    
    // ===== Mobile Navigation Toggle =====
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close menu when clicking a nav link on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // ===== Smooth Scrolling for Navigation Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just a "#" or if it's meant for another purpose
            if (targetId === '#' || this.classList.contains('add-to-cart')) {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update active link manually
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // ===== Update Active Navigation Link on Scroll =====
    function updateActiveNavOnScroll() {
        const scrollPosition = window.scrollY;
        const headerHeight = header.offsetHeight;
        
        // Check each section and update the active link
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100; // Add some offset
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ===== Menu Filtering =====
    menuCategories.forEach(category => {
        category.addEventListener('click', function() {
            // Update active button
            menuCategories.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-category');
            
            // Filter menu items
            menuItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else if (item.getAttribute('data-category').includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
   
    
    // ===== Testimonial Slider =====
    function showTestimonial(index) {
        // Update current index
        currentTestimonial = index;
        
        // Update testimonial position
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active dot
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Next testimonial
    nextButton.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCount;
        showTestimonial(currentTestimonial);
    });
    
    // Previous testimonial
    prevButton.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial - 1 + testimonialCount) % testimonialCount;
        showTestimonial(currentTestimonial);
    });
    
    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Auto rotate testimonials
    let testimonialInterval = setInterval(() => {
        nextButton.click();
    }, 5000);
    
    // Pause auto rotation when hovering over testimonials
    testimonialTrack.addEventListener('mouseenter', function() {
        clearInterval(testimonialInterval);
    });
    
    testimonialTrack.addEventListener('mouseleave', function() {
        testimonialInterval = setInterval(() => {
            nextButton.click();
        }, 5000);
    });
    
    // ===== Add to Cart Button Animation =====
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalText = this.textContent;
            this.textContent = 'Added! ✓';
            this.style.backgroundColor = '#4CAF50';
            this.style.color = 'white';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 2000);
        });
    });
    
    // ===== Newsletter Form Submission =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button');
            const originalButtonText = submitButton.innerHTML;
            
            // Simple validation
            if (!emailInput.value.trim()) {
                alert('Please enter your email address.');
                return;
            }
            
            // Simulate form submission
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                emailInput.value = '';
                submitButton.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // ===== Initialize Animation on Scroll =====
    function revealOnScroll() {
        const elements = document.querySelectorAll('.feature, .menu-item, .special-card, .contact-card, .video-container');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Add CSS for reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .feature, .menu-item, .special-card, .contact-card, .video-container {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .feature.revealed, .menu-item.revealed, .special-card.revealed, .contact-card.revealed, .video-container.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        .video-container.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            margin: -25px 0 0 -25px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Initial check on load
    window.addEventListener('load', revealOnScroll);
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // ===== Image Loading Animation =====
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = function() {
            img.style.opacity = '1';
        };
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // ===== Video Poster Loading ===== 
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Set poster loading state
        if (video.hasAttribute('poster')) {
            const posterImg = new Image();
            posterImg.src = video.getAttribute('poster');
            
            posterImg.onload = function() {
                video.parentElement.classList.remove('loading');
            };
        }
    });
});