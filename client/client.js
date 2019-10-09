/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
/* eslint-disable arrow-body-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
const socket = io();
const publicKey = 'BDPAlowB9sE_rlRlcJEZZKJbnae338okQwK1b_rKFcBdozZkBfCfx7FaRgfyOckR7qgCzoAV74zonnW7pw2qj2s';

navigator.serviceWorker.register('/worker.js').then(() => {
  return navigator.serviceWorker.ready;
}).then((reg) => {
  console.log('Service Worker is ready');
  reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  }).then((sub) => {
    console.log('endpoint:', sub.endpoint);
  });
}).catch((error) => {
  console.log('Error : ', error);
});


const urlBase64ToUint8Array = (base64String) => {
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
};

// check if the service worker is in the browser's api
if ('serviceWorker' in navigator) {
  send().catch((err) => console.log(err));
}

socket.on('welcome', (data) => {
  console.log(data);
});

socket.on('new_travel_request', (data) => {
  showNewTravelRequestNotification(data);
});

socket.on('request_update', async (data) => {
  requestUpdateNotification(data);
});

socket.on('travel_request_response', (data) => {
  showRequestDecisionNotification(data);
});

socket.on('travel_request_update', (data) => {
  console.log(data);
  showTravelRequestUpdateNotification(data);
});
