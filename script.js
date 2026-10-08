/**
 * Dr. Lesley Norris, PhD - Website Scripts
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
        });
    }

    // Close mobile nav when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);
    highlightNavOnScroll(); // Run on page load

    // Smooth scroll for browsers that don't support CSS scroll-behavior
    // (This is a fallback - modern browsers handle this via CSS)
    if (!CSS.supports('scroll-behavior', 'smooth')) {
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Resources Carousel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const cards = track.querySelectorAll('.resource-card');
        const prevBtn = carousel.querySelector('.carousel-btn-prev');
        const nextBtn = carousel.querySelector('.carousel-btn-next');
        const dotsContainer = document.querySelector('.carousel-dots');

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            const width = window.innerWidth;
            if (width <= 480) return 1;
            if (width <= 768) return 2;
            return 3;
        }

        function getTotalSlides() {
            return Math.max(0, cards.length - cardsPerView + 1);
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            const totalSlides = getTotalSlides();
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', function() {
                    goToSlide(i);
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = 'translateX(-' + offset + 'px)';

            // Update dots
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === currentIndex);
            });

            // Update buttons
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= getTotalSlides() - 1;
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, getTotalSlides() - 1));
            updateCarousel();
        }

        prevBtn.addEventListener('click', function() {
            goToSlide(currentIndex - 1);
        });

        nextBtn.addEventListener('click', function() {
            goToSlide(currentIndex + 1);
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = Math.min(currentIndex, getTotalSlides() - 1);
                createDots();
                updateCarousel();
            }
        });

        // Initialize
        createDots();
        updateCarousel();
    }
});
