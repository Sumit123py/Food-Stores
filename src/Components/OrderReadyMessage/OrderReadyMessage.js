import React from 'react';
import './orderReadyMessage.css';
import toast from 'react-hot-toast';
import supabase from '../../Services/Supabase';
import useSupabaseRealtime from '../../Services/useSupabaseRealtime';

const OrderReadyMessage = ({userId}) => {

    useSupabaseRealtime('users', 'users')


    const handleCloseReadyMessage = async (userId) => {
        const { error: userError } = await supabase
        .from("users")
        .update({
          message: false
        })
        .eq("id", userId);

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
