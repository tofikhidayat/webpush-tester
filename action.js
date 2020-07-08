function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

document.addEventListener('DOMContentLoaded', e => {
    const vavidEl = document.querySelector('#vavid');
    const vavidUri = window.location.search.replace(/^.*?\=/, '')
    const realvavid = decodeURIComponent(vavidUri)
    vavidEl.textContent = realvavid
    const endpoint = document.querySelector('#endpoint')
    const expiration = document.querySelector('#expired')
    const p256dh = document.querySelector('#dec')
    const auth = document.querySelector('#auth')

    console.log(realvavid)

    if(realvavid.length > 20) {

        if (("Notification" in window)) {
            console.log(Notification.permission)
                if(Notification.permission == "denied") {
                    alert('Dont block notif please')
                } else {
                    Notification.requestPermission()
                    .then(permit => {
                        navigator.serviceWorker.register('/sw.js', {
                            scope: '/'
                        })
                        .then(async (register) => {
                
                            const publicVapidKey = realvavid;
                            const subscription = await register.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                            });
                            const parsed = JSON.parse(JSON.stringify(subscription))
                            console.log(parsed)
                            endpoint.textContent = parsed.endpoint
                            expiration.textContent = parsed.expirationTime  || 'null'
                            p256dh.textContent = parsed.keys.p256dh
                            auth.textContent = parsed.keys.auth

                        })
                        .catch(e => {
                            console.log('err')
                            console.log(e)
                            window.location.reload()
                        })
                    });
                }
        } else {
            alert("BROWSER NOT SUPPORTED")
        }
        }
   
    
})


document.querySelector('#submit').addEventListener('click', e => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister()
        }
    })
})