import React, { useState, useRef, useEffect } from 'react';
import { deleteFood, getFood } from '../../Services/apiFood';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import FoodAddForm from '../FoodAddForm/FoodAddForm';
import Spinner from '../../spinLoader/Spinner';
import './foodDashboard.css'

const FoodDashboard = ({ setCurrentAction, currentAction }) => {
  const [foodToEdit, setFoodToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const bottomRef = useRef(null);

  const { isLoading, data: food, error } = useQuery({
    queryKey: ['foods'],
    queryFn: () => getFood(),
  });

  const { isDeleting, mutate } = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      toast.success('Food successfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['foods'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (showForm && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showForm]);

  if (isLoading) return <Spinner />;

  if (!food) return <p>An error occurred</p>;

  return (
    <>
      <div className='foodDashboardContainer'>
        {food.map((foodItem, index) => (
          <div key={index} className="foodContainer">
            <div className="columnImg img">
              <img src={foodItem.image} alt="" />
            </div>
            <p className="column foodName">{foodItem.foodName}</p>
            <p className="column foodPrice">₹{foodItem.foodPrice}</p>
            <p className="column ingredients">{foodItem.ingredients}</p>
            <button
              onClick={() => {
                setFoodToEdit(foodItem);
                setShowForm(true);
              }}
              className="Btn"
            >
              Edit
              <svg className="svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
            <button onClick={() => mutate(foodItem.id)} disabled={isDeleting} className="Btn">
              Delete
            <svg className="svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
          </div>
        ))}
        {showForm && (
          <FoodAddForm
            setShowForm={setShowForm}
            foodToEdit={foodToEdit}
            setCurrentAction={setCurrentAction}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {/* second */}


      <div className='foodDashboardContainer2'>
        {food.map((foodItem, index) => (
          <div key={index} className="foodContainer">
            <div className="columnImg img">
              <img src={foodItem.image} alt="" />
            </div>
            <div className="foodAbout">
            <p className="column foodName">{foodItem.foodName}</p>
            <p className="column foodPrice">₹{foodItem.foodPrice}</p>
            </div>
            <p className="column ingredients">{foodItem.ingredients}</p>

            <div className="editBtns">
            <button
              onClick={() => {
                setFoodToEdit(foodItem);
                setShowForm(true);
              }}
              className="Btn"
            >
              Edit
              <svg className="svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
            <button onClick={() => mutate(foodItem.id)} disabled={isDeleting} className="Btn">
              Delete
            <svg className="svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
            </div>
          </div>
        ))}
        {showForm && (
          <FoodAddForm
            setShowForm={setShowForm}
            foodToEdit={foodToEdit}
            setCurrentAction={setCurrentAction}
          />
        )}
        <div ref={bottomRef} />
      </div>
    </>
  );
};

export default FoodDashboard;
