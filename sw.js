self.addEventListener('push', (event) => {
  const text = (event.data && event.data.json()) || false;
  console.log(text)
  let title = text ? text.title : 'Yay a message'
  let body = text ? text.body : 'Example message';
  let tag = text ? text.tag : 'testing'
  let url = text ? text.redirect : 'texting.com'
  let icon = 'https://www.postman.com/assets/logos/canary-treated-logo.svg';
  
  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag, data:{url}})
  )

});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.data.url)
  );
})