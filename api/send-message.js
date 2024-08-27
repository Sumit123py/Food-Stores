const express = require("express");
const firebaseAdmin = require("firebase-admin");
const cors = require("cors");
const firebaseServiceAccount = require("../firebase-service-account.json");
const supabase = require("../src/Components/backend/Supabase"); // Assuming you have Supabase integration
import { fetchUserFromDatabase, getOrdersByUserId } from '../src/utils'
const app = express();

// Allow requests from your React app
app.use(cors({
  origin: '*', // or '*' to allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-fcm-token'],
}));

app.use(express.json());

// Initialize Firebase app
const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});

// Initialize Firebase messaging
const messaging = firebaseApp.messaging();

// Function to check user and order status
async function checkUserAndOrderStatus(userId) {
  const user = await fetchUserFromDatabase(userId);
  if (!user?.message) return false;

  const orders = await getOrdersByUserId(userId);
  const hasPendingOrders = orders.some(order => order.Approval === 'Pending');

  return hasPendingOrders;
}

// Function to send notification
async function sendNotification(token, title, body, url) {
  const message = {
    token,
    data: { 
      title,
      body,
      click_action: url,
      icon: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
      badge: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
    },
  };

  await messaging.send(message);
}

app.post("/api/send-message", async (req, res) => {
  const userId = req.body.userId || req.query.userId;
  const token = req.body.token || req.query.token || req.headers["x-fcm-token"];
  const title = req.query.title || "Default Title";
  const body = req.query.body || "Default Body";
  const url = req.query.url || "https://shivaaysweets.vercel.app";

  const duration = 5 * 60 * 1000; // 5 minutes
  const interval = 30 * 1000; // 30 seconds
  const startTime = Date.now();

  try {
    // Loop for 5 minutes, sending messages every 30 seconds
    const sendMessagesLoop = async () => {
      if (Date.now() - startTime >= duration) return; // Stop after 5 minutes

      // Check user and order status
      const shouldContinue = await checkUserAndOrderStatus(userId);

      if (shouldContinue) {
        // Send notification if the condition is met
        await sendNotification(token, title, body, url);

        // Continue the loop after the interval
        setTimeout(sendMessagesLoop, interval);
      } else {
        // Stop sending notifications if conditions are not met
        console.log("Conditions not met, stopping notifications.");
      }
    };

    sendMessagesLoop(); // Start the loop

    res.status(200).json({
      message: "Notification loop started successfully",
    });
  } catch (error) {
    console.error("Error in notification loop:", error);
    res.status(500).json({
      status: "error",
      message: error?.message || "Something went wrong",
    });
  }
});

// Export the app to be used as a Vercel serverless function
module.exports = app;
