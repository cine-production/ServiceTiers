// Vérifier si le navigateur supporte les notifications
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Les notifications push sont supportées.');

    // Enregistrer le service worker
    navigator.serviceWorker.register('service-worker.js')
        .then(swReg => {
            console.log('Service Worker enregistré :', swReg);
        })
        .catch(error => {
            console.error('Erreur d\'enregistrement du Service Worker :', error);
        });
} else {
    console.warn('Les notifications push ne sont pas supportées.');
}

// Gérer l'autorisation pour les notifications
document.getElementById('enableNotifications').addEventListener('click', async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Permission pour les notifications accordée.');
        } else {
            console.log('Permission refusée.');
        }
    } catch (error) {
        console.error('Erreur lors de la demande de permission :', error);
    }
});
