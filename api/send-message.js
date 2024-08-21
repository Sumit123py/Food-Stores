const express = require("express");
const firebaseAdmin = require("firebase-admin");
const cors = require("cors");
const firebaseServiceAccount = require("../firebase-service-account.json");

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

app.get("/api/send-message", async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-fcm-token"];
    const title = req.query.title || "Default Title"; // Default title if not provided
    const body = req.query.body || "Default Body"; // Default body if not provided

    const message = {
      token,
      data: {
        title,
        body,
        icon: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
        badge: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
      },
    };

    await messaging.send(message);
    res.status(200).json({
      message: "Notification sent successfully",
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      status: "error",
      message: error?.message || "Something went wrong",
    });
  }
});

// Export the app to be used as a Vercel serverless function
module.exports = app;
