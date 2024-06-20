import React from 'react'
import { createEditFood, deleteFood, getFood } from '../Services/apiFood'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

const Customer = () => {

  const queryClient = useQueryClient()

  const {isLoading, data: food, error} = useQuery({

    queryKey: ['foods'],
    queryFn: getFood

  })




  const {isDeleting, mutate} = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      toast.success('food successfully deleted');

      queryClient.invalidateQueries({
        queryKey: ['foods']
      });

    },
    onError: (err) => toast.error(err.message)
  })


  const {mutate: mutateCreate, isCreating} = useMutation({
    mutationFn: createEditFood,
    onSuccess: () => {
      toast.success('New Food created successfully')

      queryClient.invalidateQueries({
        queryKey: ['foods']
      });
    },
    onError: (err) => toast.error(err.message)
  })

  function onSubmit (data) {
    mutateCreate(data)
  }

  const {register, handleSubmit} = useForm()



  if(isLoading) return <p>Loading...</p>


  return (
    <div>
      {food.map((foods) => (
        <>
        <h1>{foods.foodName}</h1>
      <h1>{foods.foodPrice}</h1>
      <button onClick={() => mutate(foods.id)} disabled={isDeleting}>Delete</button>
        </>
      ))}
      <button>New Food</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="number" name="id" id="id" {...register('id')}/>
        <input type="text" name="foodName" id="foodName" {...register('foodName')} placeholder='Enter a foodName'/>
        
        <input type="number" name="foodPrice" id="foodPrice" {...register('foodPrice')} placeholder='Enter foodPrice' />
        <button type='submit' disabled={isCreating}>Submit</button>
      </form>
    </div>
  )
}

export default Customer;
