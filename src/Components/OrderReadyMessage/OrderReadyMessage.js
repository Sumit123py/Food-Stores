import React from 'react';
import './orderReadyMessage.css';
import toast from 'react-hot-toast';
import supabase from '../../Services/Supabase';
import useSupabaseRealtime from '../../Services/useSupabaseRealtime';

const OrderReadyMessage = ({userId, user}) => {

    useSupabaseRealtime('users', 'users')

    const sendNotification = async () => {
    
      if (!user?.fcm_token) {
        console.error('FCM token not found');
        return;
      }
      
      try {
        const response = await fetch(`https://shivaaysweets.vercel.app/api/send-message?title= Customer Coming&body=OrderID: ${user?.userShortID}&url=https://shivaaysweets.vercel.app`, {
          method: 'POST', // Use 'POST' if your server expects a POST request
          headers: {
            'Content-Type': 'application/json',
            'x-fcm-token': user?.fcm_token 
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
    };


    const handleCloseReadyMessage = async (userId) => {
        const { error: userError } = await supabase
        .from("users")
        .update({
          message: false
        })
        .eq("id", userId);

        sendNotification()

      if (userError) {
        console.error("Error updating user message:", userError);
        toast.error("Error updating user message");
        return;
      }
    }

  return (
    <div className="orderReadyMessageContainer">
      <div className="orderReadyMessage"></div>
      <div className="popUpCard">
        <p style={{ color: 'green' }} className="icon">
          <i className="fa-solid fa-circle-check"></i>
        </p>
        <p className="cookieHeading">Your Order Is Ready</p>
        <p className="cookieDescription">Thank You for using our App</p>
        <div className="buttonContainer">
          <button className="acceptButton" onClick={() => handleCloseReadyMessage(userId)}>Ok</button>
        </div>
      </div>
    </div>
  );
};

export default OrderReadyMessage;
