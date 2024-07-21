import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import supabase from './Supabase';

const useSupabaseRealtime = (tableName, queryKey, announceNewOrder = null) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  useEffect(() => {
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
        try {
          const newOrder = payload.new;
          if (announceNewOrder && newOrder) {
            announceNewOrder(newOrder, newOrder.userId);
          }

          queryClient.invalidateQueries([queryKey]);
        } catch (err) {
          console.error('Error handling realtime payload:', err);
          setError(err);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, tableName, queryKey, announceNewOrder]);

  return { error };
};

export default useSupabaseRealtime;
