const stickyHeader = document.querySelector('.sticky-nav');
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar.offsetHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > navbarHeight) {
        stickyHeader.classList.add('visible'); // Hiển thị thanh sticky
    } else {
        stickyHeader.classList.remove('visible'); // Ẩn thanh sticky
    }
});

