const express = require("express");
const firebaseAdmin = require("firebase-admin");
const cors = require("cors");
const firebaseServiceAccount = require("../firebase-service-account.json");
const supabase = require("../src/Components/backend/Supabase"); // Assuming you have Supabase integration
const { fetchUserFromDatabase, getOrdersByUserId } = require('../src/utils');

const app = express();

app.use(cors({
  origin: '*', // or '*' to allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-fcm-token'],
}));

app.use(express.json());

const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});

const messaging = firebaseApp.messaging();

async function checkUserAndOrderStatus(userId) {
  try {
    const user = await fetchUserFromDatabase(userId);
  
    if (!user?.message) return false;

    const orders = await getOrdersByUserId(userId);
    

    const hasPendingOrders = orders?.some(order => order.Approval === 'Pending');

    return hasPendingOrders;
  } catch (error) {
    console.error("Error checking user and order status:", error);
    return false;
  }
}

async function sendNotification(token, title, body, url) {
  try {
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
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

app.post("/api/send-message", async (req, res) => {
  // Access userId from request body
  const userId = req.body.userId || req.query.userId;
  const token = req.body.fcmToken || req.query.token || req.headers["x-fcm-token"];
  const title = req.query.title || "Default Title";
  const body = req.query.body || "Default Body";
  const url = req.query.url || "https://shivaaysweets.vercel.app";



  if (!userId || !token) {
    return res.status(400).json({
      message: "Missing required parameters: userId or fcmToken"
    });
  }

  const maxIterations = 10; // Add a maximum number of iterations
  const interval = 30 * 1000; // 30 seconds
  let iterationCount = 0;

  try {
    // Send a single notification before starting the loop
    await sendNotification(token, title, body, url);
    console.log("Initial notification sent successfully");
  } catch (error) {
    console.error("Error sending initial notification:", error);
    res.status(500).json({ message: "Error sending initial notification" });
    return;
  }

  async function sendMessagesLoop() {
    if (iterationCount >= maxIterations) return; // Stop after max iterations

    try {
      const shouldContinue = await checkUserAndOrderStatus(userId);

      if (shouldContinue) {
        await sendNotification(token, title, body, url);
      } else {
        console.log("Conditions not met, stopping notifications.");
        return;
      }

      iterationCount++;
      setTimeout(sendMessagesLoop, interval);
    } catch (error) {
      console.error("Error in notification loop:", error);
      // You can also try to resend the notification after a short delay
      setTimeout(sendMessagesLoop, 1000); // retry after 1 second
    }
  }

  sendMessagesLoop(); // Start the loop

  res.status(200).json({
    message: "Notification loop started successfully",
  });
});



const port = 5001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});