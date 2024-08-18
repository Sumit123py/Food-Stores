const express = require("express");
const firebaseAdmin = require("firebase-admin");
const http = require("node:http");
const cors = require("cors"); // Import the CORS package
const firebaseServiceAccount = require("./firebase-service-account.json");

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Initialize Firebase app
const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});

// Initialize Firebase messaging
const messaging = firebaseApp.messaging();

app.get("/send-message", async (req, res) => {
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

// Use environment variable PORT or default to 5000
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = server;
