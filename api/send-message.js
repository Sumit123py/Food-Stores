const express = require("express");
const firebaseAdmin = require("firebase-admin");
const cors = require("cors"); // Import the CORS package
const firebaseServiceAccount = require("../firebase-service-account.json");

const app = express();

// Enable CORS for all routes
app.use(cors());

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

    const message = {
      token,
      data: {
        title: "New Order",
        body: "Check Order",
        icon: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
        badge:
          "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
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
