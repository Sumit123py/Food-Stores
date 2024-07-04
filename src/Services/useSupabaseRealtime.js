// src/hooks/useSupabaseRealtime.js
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import supabase from './Supabase';

const useSupabaseRealtime = (tableName, queryKey, announceNewOrder) => {
  const queryClient = useQueryClient();



  useEffect(() => {
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
        const newOrder = payload.new
        announceNewOrder(newOrder, newOrder.userId)
        console.log('pat', newOrder.userId)
       
        queryClient.invalidateQueries([queryKey]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, tableName, queryKey]);

  
};

export default useSupabaseRealtime;
