
import { useEffect } from 'react';
import { supabase } from './supabaseClient';
import toast from 'react-hot-toast';

const useOrderNotifications = () => {
  useEffect(() => {
    const subscription = supabase
      .from('Orders')  // Make sure this matches your table name
      .on('INSERT', payload => {
        toast.success(`New order placed: ${payload.new.foodName}`);
        console.log('New order received!', payload);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return null;
};

export default useOrderNotifications;
