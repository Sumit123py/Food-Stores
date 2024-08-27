const cron = require('node-cron');
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

const scheduledTasks = new Map();

app.post('/api/schedule-message', async (req, res) => {
  try {
    const { fcmToken, delayInSeconds, userId, title, body, url } = req.body;

    if (!fcmToken || !delayInSeconds || !userId) {
      return res.status(400).json({ error: 'fcmToken, delayInSeconds, and userId are required' });
    }

    if (scheduledTasks.has(userId)) {
      return res.status(400).json({ error: 'A notification is already scheduled for this user' });
    }

    const intervalSeconds = 30;
    const totalTimes = Math.floor(delayInSeconds / intervalSeconds);
    let count = 0;

    const task = cron.schedule(`*/${intervalSeconds} * * * * *`, async () => {
      if (count >= totalTimes) {
        task.stop();
        scheduledTasks.delete(userId);
        return;
      }

      const user = await fetchUserFromDatabase(userId);
      if (!user?.message) {
        task.stop();
        scheduledTasks.delete(userId);
        return;
      }

      const orders = await getOrdersByUserId(userId);
      const hasPendingOrders = orders.some(order => order.Approval === 'Pending');
      if (!hasPendingOrders) {
        task.stop();
        scheduledTasks.delete(userId);
        return;
      }

      try {
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
        console.log('Server Response:', data);
      } catch (error) {
        console.error('Error sending notification:', error);
      }

      count++;
    });

    scheduledTasks.set(userId, task);
    res.status(200).json({ message: 'Notification scheduled successfully' });
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
