// src/hooks/useSupabaseRealtime.js
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import supabase from './Supabase';

const useSupabaseRealtime = (tableName, queryKey, announceNewOrder = null) => {
  const queryClient = useQueryClient();



  useEffect(() => {
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
        const newOrder = payload.new
        if (announceNewOrder) {
          announceNewOrder(newOrder, newOrder.userId);
        }

        console.log('ann', newOrder)
        
       
        queryClient.invalidateQueries([queryKey]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, tableName, queryKey]);

  
};

export default useSupabaseRealtime;
