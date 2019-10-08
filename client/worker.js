/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */

const showNewTravelRequestNotification = (data) => {
  navigator.serviceWorker.getRegistration().then((reg) => {
    reg.showNotification(`New ${data.title} Travel Request`, {  
      body: `${data.from}`
    });
  });
};
