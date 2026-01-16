const track = document.getElementById('productsTrack');
const slider = document.getElementById('productsSlider');
const progressFill = document.getElementById('progressFill');
const cards = document.querySelectorAll('.product-card');

let isDragging = false;
let startX, scrollLeft;
let dragStartX = 0;

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (Math.abs(e.pageX - dragStartX) > 10) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});

const updateUI = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll > 0) {
        const percent = (track.scrollLeft / maxScroll) * 100;
        progressFill.style.width = Math.max(0, Math.min(100, percent)) + '%';
    }

    const sliderRight = slider.getBoundingClientRect().right;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isClipped = rect.right > sliderRight + 5 && rect.left < sliderRight - 5;
        card.classList.toggle('is-faded', isClipped);
    });
    
    if (isDragging) requestAnimationFrame(updateUI);
};

const snapToCard = () => {
    const cardWidth = cards[0].offsetWidth + 30;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;

    if (maxScroll - currentScroll < cardWidth / 2) {
        track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
        const index = Math.round(currentScroll / cardWidth);
        track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
    
    const checkScroll = setInterval(updateUI, 15);
    setTimeout(() => clearInterval(checkScroll), 600);
};

track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    dragStartX = e.pageX;
    cancelAnimationFrame(updateUI); 
    requestAnimationFrame(updateUI);
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    snapToCard();
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeft - walk;
});

track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    dragStartX = e.touches[0].pageX;
});

track.addEventListener('touchend', () => {
    isDragging = false;
    snapToCard();
});

track.addEventListener('touchmove', (e) => {
    if(!isDragging) return;
    const x = e.touches[0].pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeft - walk;
}, { passive: false });

window.addEventListener('load', updateUI);
window.addEventListener('resize', updateUI);
track.addEventListener('scroll', updateUI);