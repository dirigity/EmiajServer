
const publicVapidKey = 'BCs48b6RZVRLP_9vxQa0_fpzTNkcMu_ylxfmJLNo3KcY6lD3wnUEFXOQUc_YxUo6vz1Fj9fogCXUXw9iGndmfEM';

self.addEventListener('push', event => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.content,
    });
});

self.addEventListener("pushsubscriptionchange", event => {
    event.waitUntil(swRegistration.pushManager.subscribe(event.oldSubscription.options)
        .then(subscription => {
            console.log(subscription)
            fetch('/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        })
    );
}, false);