document.addEventListener("DOMContentLoaded", function(event) {
    var loadscreen = document.getElementById('loadscreen');
    var logo = document.getElementById('logo');

    setTimeout(function() {
        logo.style.opacity = "1";
    }, 100);

    setTimeout(function() {
        logo.style.opacity = "0";
    }, 4000);

    setTimeout(function() {
        loadscreen.style.opacity = "0";
    }, 5000);

    setTimeout(function() {
        loadscreen.style.display = "none";
    }, 7000);
});