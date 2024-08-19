import React, { useContext } from "react";
import "./option.css";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from "../../Services/Supabase";
import toast from "react-hot-toast";
import { getUser } from "../../Services/apiUsers";

const Option = ({ i, index, setIndex, userId }) => {
  const queryClient = useQueryClient();

  const { isLoading: userLoading, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const currentUser = users?.filter(
    (user) => user?.id === userId
  );

  const user = currentUser?.[0];


  const sendNotification = async () => {
    // Obtain the token from local storage or another source
    console.log('FCM Token:', user?.fcm_token);
    
    if (!user?.fcm_token) {
      console.error('FCM token not found');
      return;
    }
    
    try {
      const response = await fetch(`https://shivaaysweets.vercel.app/api/send-message`, {
        method: 'GET', // Use 'POST' if your server expects a POST request
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

  const { mutate: updateOrderStatus } = useMutation(
    async ({ status, userId }) => {
      const { error: orderError } = await supabase
        .from("Orders")
        .update({ orderStatus: status })
        .eq("userId", userId);

      if (orderError) {
        throw new Error(orderError.message);
      }

      if (status === 'Ready') {
        sendNotification()
        const { error: userError } = await supabase
          .from("users")
          .update({ message: true })
          .eq("id", userId);

        if (userError) {
          throw new Error(userError.message);
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Orders');
        queryClient.invalidateQueries('users');
        toast.success("Status updated successfully");
      },
      onError: (error) => {
        console.error("Error updating order status:", error);
        toast.error("Error updating order status");
      },
    }
  );

  const handleOrderStatus = (status, userId) => {
    setIndex(null);
    updateOrderStatus({ status, userId });
  };

  return (
    <div style={{ height: index === i ? '80px' : 0 }} className="dropDown">
      <p className="ready" onClick={() => handleOrderStatus('Ready', userId)}>Ready</p>
      <p className="preparing" onClick={() => handleOrderStatus('Preparing', userId)}>Preparing</p>
    </div>
  );
};

export default Option;
