var navbar = document.getElementById('navbar');
var hamburger = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');
var menuCarousel = document.getElementById('menuCarousel');
var trackEl = menuCarousel.parentElement;
var prevBtn = document.getElementById('menuPrev');
var nextBtn = document.getElementById('menuNext');
var dotsContainer = document.getElementById('carouselDots');

window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNav();
});

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-item').forEach(function(link) {
    link.addEventListener('click', function() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var scrollPos = window.scrollY + 120;
    var currentId = '';

    sections.forEach(function(sec) {
        if (sec.offsetTop <= scrollPos) {
            currentId = sec.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + currentId) {
            item.classList.add('active');
        }
    });
}

var carouselCards = menuCarousel.querySelectorAll('.menu-card');
var numCards = carouselCards.length;
var curSlide = 0;
var gap = 20;

function perView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
}

function totalPages() {
    return Math.ceil(numCards / perView());
}

function getCardWidth() {
    var visibleW = trackEl.offsetWidth;
    var pv = perView();
    return (visibleW - gap * (pv - 1)) / pv;
}

function sizeCards() {
    var cardW = getCardWidth();
    for (var i = 0; i < carouselCards.length; i++) {
        carouselCards[i].style.minWidth = cardW + 'px';
        carouselCards[i].style.maxWidth = cardW + 'px';
    }
}

function renderDots() {
    dotsContainer.innerHTML = '';
    var pages = totalPages();
    for (var i = 0; i < pages; i++) {
        var d = document.createElement('span');
        d.className = 'dot' + (i === curSlide ? ' active' : '');
        d.setAttribute('data-idx', i);
        d.addEventListener('click', function() {
            curSlide = parseInt(this.getAttribute('data-idx'));
            goTo(curSlide);
        });
        dotsContainer.appendChild(d);
    }
}

function goTo(page) {
    var pages = totalPages();
    if (page < 0) page = pages - 1;
    if (page >= pages) page = 0;
    curSlide = page;

    var pv = perView();
    var cardW = getCardWidth();
    var stepW = cardW + gap;
    var visibleW = trackEl.offsetWidth;

    var startCard = curSlide * pv;
    var offset = startCard * stepW;

    var totalW = numCards * stepW - gap;
    var maxOff = totalW - visibleW;
    if (maxOff < 0) maxOff = 0;
    if (offset > maxOff) offset = maxOff;

    menuCarousel.style.transform = 'translateX(' + (-offset) + 'px)';

    var dots = dotsContainer.querySelectorAll('.dot');
    for (var i = 0; i < dots.length; i++) {
        dots[i].className = 'dot' + (i === curSlide ? ' active' : '');
    }
}

prevBtn.addEventListener('click', function() { goTo(curSlide - 1); });
nextBtn.addEventListener('click', function() { goTo(curSlide + 1); });

function initCarousel() {
    sizeCards();
    curSlide = 0;
    renderDots();
    goTo(0);
}

initCarousel();

var resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCarousel, 150);
});

var observerOpts = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

var fadeIn = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOpts);

document.querySelectorAll('.about-section, .gallery-section, .menu-section, .order-section, .contact-section').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    fadeIn.observe(el);
});
