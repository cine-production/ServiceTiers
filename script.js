document.addEventListener('DOMContentLoaded', loader);

function loader() {
  let loaderPage = document.querySelector('.loader-page');
  let progressBar = document.querySelector('.progress-bar');
  let loaderbutton = document.querySelector('.enter-button');
  let counter = document.querySelector('.loader-counter');
  let fill = document.querySelector('.progress-fill');
  let amount = 1;
  let interval = setInterval(loop, 80);

  function loop() {
    if (amount >= 100) {
      clearInterval(interval);
      hideLoaderpage(); // Show the "ENTRER" button with fade-in effect
      
      setTimeout(() => hideLoader(), 5000);
      setTimeout(() => showButton(), 5500); // Show the loader after 1 second (you can adjust the duration)
    } else {
      amount++;
      fill.style.width = amount + '%';
      counter.textContent = amount + '%';
    }
  }
}

function showEnterButton() {
  const enterButton = document.querySelector('.enter-button');
  enterButton.style.display = 'flex';
  enterButton.style.opacity = '1'; // Fade-in effect with opacity change
}

function hideLoader() {
  let counter = document.querySelector('.loader-counter');
  let progressBar = document.querySelector('.progress-bar');
  progressBar.style.opacity = '0';
  counter.style.opacity = '0'; // Fade-out effect with opacity change
  setTimeout(() => progressBar.style.visibility = 'hidden', 5000);
  setTimeout(() => counter.style.visibility = 'hidden', 5000); // Hide the loader after 1 second (you can adjust the duration)
}

function showButton() {
  let loaderbutton = document.querySelector('.enter-button');
  loaderbutton.style.opacity = '1'; // Fade-out effect with opacity change
  setTimeout(() => loaderbutton.style.visibility = 'visible', 5000); // Show the button after 1 second (you can adjust the duration)
  loaderbutton.addEventListener('click', showPopup);
}

function hideLoaderpage() {
  let loaderPage = document.querySelector('.loader-page');
  loaderPage.style.opacity = '0'; // Fade-out effect with opacity change
  setTimeout(() => loaderPage.style.visibility = 'hidden', 5000); // Hide the loader after 1 second (you can adjust the duration)
}

// Click event listener for the "Close" button in the popup
document.querySelector('.close-button').addEventListener('click', function() {
  const popup = document.querySelector('.popup');
  const overlay = document.querySelector('.overlay-bg');
  popup.style.opacity = '0'; // Fade-out effect with opacity change
  closeButton.style.opacity = '0'; // Fade-out effect for the close button
  setTimeout(() => {
    popup.style.display = 'none';
    closeButton.style.display = 'none';
    overlay.classList.remove('show');
  }, 500); // Hide the popup, close button, and overlay after 0.5 second (you can adjust the duration)
});

// Click event listener for the "ENTRER" button
document.querySelector('.enter-button').addEventListener('click', function() {
  hideLoaderpage(); // Hide the loader when the "ENTRER" button is clicked
});
