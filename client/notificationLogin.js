
// function urlBase64ToUint8Array(base64String) {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//         .replace(/-/g, '+')
//         .replace(/_/g, '/');

//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);

//     for (let i = 0; i < rawData.length; ++i) {
//         outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
// }

const publicVapidKey = 'BCs48b6RZVRLP_9vxQa0_fpzTNkcMu_ylxfmJLNo3KcY6lD3wnUEFXOQUc_YxUo6vz1Fj9fogCXUXw9iGndmfEM';

async function triggerPushNotification() {
    if ('serviceWorker' in navigator) {
        console.log("creating worker")
        const register = await navigator.serviceWorker.register('sw.js', {
            scope: '/'
        });
        fetch('/GetId', {
            method: 'GET'
        }).then(function (response) {
            response.json().then(function (data) {
                register.active.postMessage(JSON.parse(JSON.stringify({ "purpose": "Defribilatior", "id": JSON.parse(data).id })));

            });
        })
    } else {
        console.error('Service workers are not supported in this browser');
    }
}
