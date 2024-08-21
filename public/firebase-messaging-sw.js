// Here I am using Firebase version 10.12.3, 
// you can use Firebase version 10.12.3 and above, 
// because the Firebase legacy API has been turned off as of July 20 2024,
// see https://firebase.google.com/docs/cloud- messaging/migrate-v1
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-app-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-messaging-compat.min.js");

firebase.initializeApp({
  apiKey: "AIzaSyAVpVBv_XdrlBr_qLHxcf76ghlFiSPJVFk",
  authDomain: "food-store-5dfd9.firebaseapp.com",
  projectId: "food-store-5dfd9",
  storageBucket: "food-store-5dfd9.appspot.com",
  messagingSenderId: "817996691421",
  appId: "1:817996691421:web:7b6e58bf5c266b4d9ca834",
  measurementId: "G-D80S89L2MT"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (message) => {
  console.log("firebase-messaging-sw.js: Received background message ", message);

  self?.registration?.showNotification(message?.data?.title || "Notification Title", {
    icon: message?.data?.icon,
    badge: message?.data?.badge,
    body: message?.data?.body
  })
})

// importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-app-compat.min.js");
// importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-messaging-compat.min.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyAVpVBv_XdrlBr_qLHxcf76ghlFiSPJVFk",
//   authDomain: "food-store-5dfd9.firebaseapp.com",
//   projectId: "food-store-5dfd9",
//   storageBucket: "food-store-5dfd9.appspot.com",
//   messagingSenderId: "817996691421",
//   appId: "1:817996691421:web:7b6e58bf5c266b4d9ca834",
//   measurementId: "G-D80S89L2MT"
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message ', payload);

//   const { title, body, click_action } = payload.data;

//   const notificationOptions = {
//     body: body,
//     icon: payload.notification.icon || 'https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png',
//     badge: 'https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png', // Optional: add a badge image if needed
//   };

//   self.registration.showNotification(title, notificationOptions);
// });

// self.addEventListener('notificationclick', (event) => {
//   const urlToOpen = event.notification.data.click_action || 'https://shivaaysweets.vercel.app';
//   event.notification.close();

//   event.waitUntil(
//     clients.openWindow(urlToOpen)
//   );
// });
