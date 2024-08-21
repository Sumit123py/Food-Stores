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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  const { title, body, click_action, icon, badge } = payload.data || {};

  const notificationOptions = {
    body: body || "Default body text",
    icon: icon || "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
    badge: badge || "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
    data: {
      click_action: click_action || "https://shivaaysweets.vercel.app" // Default URL if not provided
    }
  };

  self.registration.showNotification(title || "Default Title", notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  const urlToOpen = event.notification.data.click_action || 'https://shivaaysweets.vercel.app';
  event.notification.close(); // Close the notification

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
