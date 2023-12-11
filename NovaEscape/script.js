document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("overlay").style.animation = "glitch 3s infinite";
        document.getElementById("overlay").innerHTML = "<div id='glitch-text'>Texte mystérieux...</div>";
    }, 7000);

    setTimeout(function () {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("background-music").pause();
        document.getElementById("form-container").style.display = "block";
    }, 8000);
});

@keyframes glitch {
    0% {
        transform: translate(0);
    }
    25% {
        transform: translate(4px, -4px);
    }
    50% {
        transform: translate(-4px, 4px);
    }
    75% {
        transform: translate(2px, -2px);
    }
    100% {
        transform: translate(0);
    }
}
