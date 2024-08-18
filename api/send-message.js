// api/send-message.js
import firebaseAdmin from 'firebase-admin';
import firebaseServiceAccount from './firebase-service-account.json';

// Initialize Firebase app
if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount)
  });
}
const messaging = firebaseAdmin.messaging();

export default async function handler(req, res) {
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', 'https://merry-creponne-813bed.netlify.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { token } = req.body;

      console.log('Received token:', token);

      if (!token) {
        return res.status(400).json({ message: 'FCM token is required' });
      }

      const message = {
        token,
        notification: {
          title: "New Order",
          body: "Check Order",
          icon: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
          badge: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png"
        }
      };

      // Send the notification
      await messaging.send(message);
      console.log('Notification sent successfully');
      res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error('Error sending notification:', error.message);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
