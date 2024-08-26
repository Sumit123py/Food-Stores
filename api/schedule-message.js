const cron = require('node-cron');
const supabase = require('../src/Components/backend/Supabase');
const fetch = require('node-fetch');

// Initialize CORS
const cors = require("cors")({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-fcm-token'],
});

const scheduledTasks = new Map(); // Use a Map to track scheduled tasks

export default async function handler(req, res) {
  // Apply CORS middleware to every request
  cors(req, res, async () => {
    if (req.method === 'POST' && req.url === '/api/schedule-message') {
      try {
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
          console.log('Orders:', orders);

          if (!hasPendingOrders) {
            task.stop(); // Stop the task if there are no pending orders
            scheduledTasks.delete(userId); // Remove the task from the map
            return;
          }

          try {
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
      } catch (error) {
        console.error('Error in handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}

const fetchUserFromDatabase = async (userId) => {
  // Replace with your actual database call or API request
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  return user;
};

// Function to fetch orders by userId
const getOrdersByUserId = async (userId) => {
  const { data: orders, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error("Orders could not be loaded");
  }

  return orders;
};
