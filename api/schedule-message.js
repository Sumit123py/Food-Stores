const express = require('express');
const cors = require('cors');
const supabase = require('../src/Components/backend/Supabase');
const firebaseAdmin = require('firebase-admin');
const firebaseServiceAccount = require("../firebase-service-account.json");

const app = express();

app.use(cors({
  origin: '*',
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

app.post("/api/send-message", async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-fcm-token"];
    const title = req.query.title || "Default Title"; // Default title if not provided
    const body = req.query.body || "Default Body"; // Default body if not provided
    const url = req.query.url || "https://shivaaysweets.vercel.app"; // Default URL if not provided

    const message = {
      token,
      data: { 
        title,
        body,
        click_action: url,
        icon: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
        badge: "https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png",
        sound: "custom_sound.mp3", // Custom notification sound file
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

// Helper function to fetch user from Supabase
const fetchUserFromDatabase = async (userId) => {
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  return user;
};

// Helper function to fetch orders by userId from Supabase
const getOrdersByUserId = async (userId) => {
  const { data: orders, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('userId', userId);

  if (error) {
    throw new Error("Orders could not be loaded");
  }

  return orders;
};

// Cron job logic should be moved outside of Vercel's serverless functions
// Consider using Vercel's built-in scheduler or another third-party scheduler for this logic

module.exports = app;
