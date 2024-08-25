const cron = require('node-cron');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const supabase = require('../src/Components/backend/Supabase');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-fcm-token'],
}));

const scheduledTasks = new Map(); // Use a Map to track scheduled tasks

app.post('/api/schedule-message', async (req, res) => {
  const { fcmToken, delayInSeconds, userId, title, body, url } = req.body;

  if (!fcmToken || !delayInSeconds || !userId) {
    return res.status(400).json({ error: 'fcmToken, delayInSeconds, and userId are required' });
  }

  // Check if a task for this userId already exists
  if (scheduledTasks.has(userId)) {
    return res.status(400).json({ error: 'A notification is already scheduled for this user' });
  }

  // Calculate how many times the notification should be sent
  const intervalSeconds = 30;
  const totalTimes = Math.floor(delayInSeconds / intervalSeconds);

  let count = 0;

  const task = cron.schedule(`*/${intervalSeconds} * * * * *`, async () => {
    if (count >= totalTimes) {
      task.stop(); // Stop the task after the required number of executions
      scheduledTasks.delete(userId); // Remove the task from the map
      return;
    }

    // Fetch user and their orders status from your database
    const user = await fetchUserFromDatabase(userId);

    console.log('User Data:', user);

    if (!user?.message) {
      task.stop(); // Stop the task if user?.message is false
      scheduledTasks.delete(userId); // Remove the task from the map
      return;
    }

    // Fetch the user's orders and check their status
    const orders = await getOrdersByUserId(userId);
    const hasPendingOrders = orders.some(order => order.Approval === 'Pending');
    console.log('or', orders)

    if (!hasPendingOrders) {
      task.stop(); // Stop the task if there are no pending orders
      scheduledTasks.delete(userId); // Remove the task from the map
      return;
    }

    try {
      const fetch = (await import('node-fetch')).default;

      // Encode the title, body, and url parameters
      const encodedTitle = encodeURIComponent(title);
      const encodedBody = encodeURIComponent(body);
      const encodedUrl = encodeURIComponent(url);

      const response = await fetch(`https://shivaaysweets.vercel.app/api/send-message?title=${encodedTitle}&body=${encodedBody}&url=${encodedUrl}`, {
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
      console.log('Server Response:', data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    count++;
  });

  scheduledTasks.set(userId, task); // Add the task to the map

  res.status(200).json({ message: 'Notification scheduled successfully' });
});

const fetchUserFromDatabase = async (userId) => {
  // Replace with your actual database call or API request
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  return user;
};

// New function to fetch orders by userId
const getOrdersByUserId = async (userId) => {
  const { data: orders, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('userId', userId)

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error("Orders could not be loaded");
  }

  return orders;
};

module.exports = app
