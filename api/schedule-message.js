const supabase = require('../src/Components/backend/Supabase');
const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const { fetchUserFromDatabase, getOrdersByUserId } = require('../src/utils');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-fcm-token'],
}));
app.use(express.json());

app.post('/api/send-scheduled-message', async (req, res) => {
  try {
    const { userId, title, body, url, fcmToken } = req.body;

    // Fetch user data from the database
    const user = await fetchUserFromDatabase(userId);

    // Check if the user has opted out of notifications
    if (!user?.message) {
      console.log('User has opted out of notifications. Exiting.');
      return res.status(200).json({ message: 'User has opted out of notifications' });
    }

    // Fetch user's orders and check their status
    const orders = await getOrdersByUserId(userId);
    const hasPendingOrders = orders.some(order => order.Approval === 'Pending');

    // If no pending orders, exit the function
    if (!hasPendingOrders) {
      console.log('No pending orders for this user. Exiting.');
      return res.status(200).json({ message: 'No pending orders for this user' });
    }

    // Send the notification if all conditions are met
    const response = await fetch(`https://shivaaysweets.vercel.app/api/send-message?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-fcm-token': fcmToken
      }
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Notification sent successfully:', data);
    res.status(200).json({ message: 'Notification sent successfully', data });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
