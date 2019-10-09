/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const showNewTravelRequestNotification = (data) => {
  navigator.serviceWorker.getRegistration().then((reg) => {
    reg.showNotification(`New ${data.title} Travel Request`, {  
      body: `${data.from}`
    });
  });
};
const showRequestDecisionNotification = (data) => {
  navigator.serviceWorker.getRegistration().then((reg) => {
    reg.showNotification(`Request ${data.status}`, {
      body: `${data.from}`,
      data: { ...data },
      icon: 'https://res.cloudinary.com/technites/image/upload/v1570698565/uploads/updated-barefoot-logo_imccx3.png',
      actions: [
        {
          action: 'show',
          title: 'View'
        },
        {
          action: 'close',
          title: 'Close'
        },
      ]
    });
  });
};

const showNewCommentNotification = (data) => {
  navigator.serviceWorker.getRegistration().then((reg) => {
    reg.showNotification(data.title, {
      body: `${data.from}`,
      data: { ...data },
      icon: 'https://res.cloudinary.com/technites/image/upload/v1570698565/uploads/updated-barefoot-logo_imccx3.png',
      actions: [
        {
          action: 'show',
          title: 'View'
        },
        {
          action: 'close',
          title: 'Close'
        },
      ]
    });
  });
};

self.addEventListener('notificationclick', (event) => {
  const baseUrl = event.currentTarget.origin;
  let url;
  event.notification.close(); // Android needs explicit close.
  switch (event.action) {
    case 'show':
      url = `${baseUrl}/api/v1/requests/${event.notification.data.data.request_id}/comments`;
      break;
    case 'close':
      event.notification.close();
      break;
    default:
      break;
  }
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
