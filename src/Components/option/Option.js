import React, { useContext } from "react";
import "./option.css";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from "../../Services/Supabase";
import toast from "react-hot-toast";

const Option = ({ i, index, setIndex, userId }) => {
  const queryClient = useQueryClient();

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
      <p onClick={() => handleOrderStatus('Ready', userId)}>Ready</p>
      <p onClick={() => handleOrderStatus('Preparing', userId)}>Preparing</p>
    </div>
  );
};

export default Option;
