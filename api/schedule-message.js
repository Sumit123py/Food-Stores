import { fetchUserFromDatabase, getOrdersByUserId } from '../src/utils'; // Adjust import path as needed
import fetch from 'node-fetch';
import supabase from '../src/Components/backend/Supabase';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  const startTime = Date.now();
  const duration = 5 * 60 * 1000; // 5 minutes in milliseconds
  const interval = 30 * 1000; // 30 seconds in milliseconds

  try {
    while (Date.now() - startTime < duration) {
      const now = new Date().toISOString();

      // Fetch messages that are due to be sent
      const { data: messages, error } = await supabase
        .from('scheduleMessages')
        .select('*')
        .lte('scheduleTime', now);

      if (error) throw new Error('Error fetching scheduled messages');

      for (const message of messages) {
        const { id, fcmToken, userId, title, body, url } = message;

        // Fetch user and their orders status
        const user = await fetchUserFromDatabase(userId);
        if (!user?.message) {
          // User condition not met, remove scheduled message
          await supabase
            .from('scheduleMessages')
            .delete()
            .eq('id', id);
          continue;
        }

        const orders = await getOrdersByUserId(userId);
        const hasPendingOrders = orders.some(order => order.Approval === 'Pending');
        if (!hasPendingOrders) {
          // No pending orders, remove scheduled message
          await supabase
            .from('scheduleMessages')
            .delete()
            .eq('id', id);
          continue;
        }

        // Send notification
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

        // Remove sent message from the database
        await supabase
          .from('scheduleMessages')
          .delete()
          .eq('id', id);
      }

      // Wait for 30 seconds before running the loop again
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    res.status(200).end('Cron job executed successfully');
  } catch (error) {
    console.error('Error in cron job:', error);
    res.status(500).end('Internal Server Error');
  }
}
