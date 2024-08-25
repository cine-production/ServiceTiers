// Clé API de Windy
const apiKey = 'lBqYrzdjgNzWbzMEM2Ba99OchQQJpXCM';

// URL de base de l'API Windy Webcams
const baseUrl = 'https://api.windy.com/api/webcams/v3/list';

// Fonction pour obtenir les webcams à partir de l'API
async function fetchWebcams() {
    // Définir la zone géographique (par exemple, Paris)
    const bbox = '2.2241,48.8156,2.4699,48.9022'; // Limites de la boîte englobante (bbox) pour Paris

    // Construire l'URL complète avec les paramètres
    const url = `${baseUrl}?bbox=${bbox}&key=${apiKey}`;

    try {
        // Appeler l'API Windy Webcams
        const response = await fetch(url);
        const data = await response.json();

        // Vérifier si les données sont récupérées avec succès
        if (data.result && data.result.webcams) {
            displayWebcams(data.result.webcams);
        } else {
            console.error('Aucune webcam trouvée dans cette zone.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des webcams:', error);
    }
}

// Fonction pour afficher les webcams sur la page
function displayWebcams(webcams) {
    const container = document.getElementById('webcams');

    // Parcourir chaque webcam et créer un élément iframe pour l'afficher
    webcams.forEach(webcam => {
        const webcamDiv = document.createElement('div');
        webcamDiv.className = 'webcam';
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://webcams.windy.com/webcams/public/embed/player/${webcam.id}`;
        iframe.allow = 'autoplay; fullscreen';

        webcamDiv.appendChild(iframe);
        container.appendChild(webcamDiv);
    });
}

// Charger les webcams lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', fetchWebcams);
