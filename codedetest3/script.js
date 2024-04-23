window.addEventListener('scroll', function() {
    var header = document.getElementById('myHeader');
    var pageTitle = document.getElementById('pageTitle');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
        pageTitle.style.opacity = '1';
    } else {
        header.classList.remove('scrolled');
        pageTitle.style.opacity = '0';
    }
});