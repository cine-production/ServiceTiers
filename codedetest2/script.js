const url = "http://192.168.1.43:1880/data/attractions.json";

function chargerAttractions() {
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Réponse réseau non ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            // Aucune attraction ouverte
            afficherErreur();
        } else {
            afficherAttractions(data);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des attractions: ", error);
        afficherErreur();
    });
}

function afficherAttractions(attractions) {
    const container = document.getElementById('attractions');
    container.innerHTML = ''; // Nettoyer le contenu précédent
    document.getElementById('erreur').style.display = 'none'; // Cacher le message d'erreur

    attractions.forEach(attraction => {
        const div = document.createElement('div');
        div.innerHTML = `<h2>${attraction.nom}</h2>
                         <p>Temps d'attente: ${attraction.tempsAttente}</p>
                         <p>Taille minimale: ${attraction.tailleMinimale}</p>`;
        container.appendChild(div);
    });
}

function afficherErreur() {
    document.getElementById('attractions').style.display = 'none'; // Cacher les attractions
    document.getElementById('erreur').style.display = 'block'; // Afficher le message d'erreur
}

window.addEventListener('load', chargerAttractions);
