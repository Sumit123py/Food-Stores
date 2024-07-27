import React, { useState } from 'react';
import './table2.css';
import Spinner from '../../../spinLoader/Spinner';
import supabase from '../../../Services/Supabase'; // Ensure this path is correct
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUserId } from '../../../Services/apiUsers';
import { getOrders } from '../../../Services/apiOrders';

const Table2 = ({ cartItems, cartLoading, appSetting }) => {
  const [deliveryType, setDeliveryType] = useState('pick-up'); // Default to 'pick-up'
  const service = appSetting?.[0].isDeliveryAvailable;
  const queryClient = useQueryClient();


  const allItemsDelivery = cartItems.every(item => item.deliveryType === 'delivery');

  const subtotal = cartItems?.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryCharges = 2;
  const totalPrice = allItemsDelivery  ? subtotal + deliveryCharges : subtotal;

  const userId = getCurrentUserId()

  

  const { mutate: updateDeliveryType } = useMutation(
    async (newDeliveryType) => {
      const { error } = await supabase
        .from('cart')
        .update({ deliveryType: newDeliveryType })
        .eq('userId', userId); // Ensure you replace 'your_user_id' with the actual user ID

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('carts');
      },
      onError: (error) => {
        console.error('Error updating deliveryType:', error);
      },
    }
  );

  const handleDeliveryTypeChange = (e) => {
    const newDeliveryType = e.target.value;
    setDeliveryType(newDeliveryType);
    updateDeliveryType(newDeliveryType);
  };

  if (cartLoading) return <Spinner />;

  return (
    <div className='table2'>
      <p className='head'>Cart Total</p>
      <div className="col1">
        <p>Subtotal</p>
        <p>₹{subtotal}</p>
      </div>
      {allItemsDelivery && (
        <div className="col2">
          <p>Delivery</p>
          <p>₹{deliveryCharges}</p>
        </div>
      )}
      <div style={{ color: 'red' }} className="col3">
        <p>Total</p>
        <p>₹{totalPrice}</p>
      </div>
      <div className="col4">
        <p>Service</p>
        {service ? (
          <select value={deliveryType} onChange={handleDeliveryTypeChange}>
            <option value="delivery">Delivery</option>
            <option value="pick-up">PickUp</option>
          </select>
        ) : (
          <p>PickUp</p>
        )}
      </div>
      {/* <button className="checkOut">Checkout</button> */}
    </div>
  );
};

export default Table2;
