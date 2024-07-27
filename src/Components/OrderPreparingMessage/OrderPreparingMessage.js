import React from 'react';
import './orderPreparingMessage.css';
import toast from 'react-hot-toast';
import supabase from '../../Services/Supabase';
import useSupabaseRealtime from '../../Services/useSupabaseRealtime';
import FoodPreparingLoader from '../FoodPreparingLoader/FoodPreparingLoader';
import { useNavigate } from 'react-router-dom';

const OrderPreparingMessage = ({setCloseReadyMessage}) => {

    useSupabaseRealtime('users', 'users')

    const navigate = useNavigate()



    
  return (
    <div className="orderReadyMessageContainer">
      <div className="orderReadyMessage"></div>
      <div className="popUpCard">
        <FoodPreparingLoader/>
        <p className="cookieHeading">Your Order Is Preparing</p>
        <p className="cookieDescription">Please Stay On The App</p>
        <div className="buttonContainer">
          <button className="acceptButton" onClick={() => {setCloseReadyMessage(false)
          navigate(-1)
          
          }}>Ok</button>
        </div>
      </div>
    </div>
  );
};

export default OrderPreparingMessage;
