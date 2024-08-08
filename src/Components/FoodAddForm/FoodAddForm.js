import React, { useState } from "react";
import { createEditFood } from "../../Services/apiFood";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import './foodAddForm.css'
import useSupabaseRealtime from "../../Services/useSupabaseRealtime";
import Spinner from "../../spinLoader/Spinner";

const FoodAddForm = ({ foodToEdit = {}, setCurrentAction, setShowForm }) => {
  const queryClient = useQueryClient();

  useSupabaseRealtime('Food', 'foods');

  const { mutate: mutateCreate, isCreating } = useMutation({
    mutationFn: createEditFood,
    onSuccess: () => {
      toast.success("New Food created successfully");

      queryClient.invalidateQueries({
        queryKey: ["foods"],
      });
      setCurrentAction('dashboard');
      reset();
      setShowForm(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: mutateEdit, isEditing } = useMutation({
    mutationFn: ({ newFoodData, id }) => createEditFood(newFoodData, id),
    onSuccess: () => {
      toast.success("Food Edited successfully");

      queryClient.invalidateQueries({
        queryKey: ["foods"],
      });
      setCurrentAction('dashboard');
      reset();
      setShowForm(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = foodToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const [weightType, setWeightType] = useState(isEditSession ? editValues.weightType : '');

  const handleWeightTypeChange = (value) => {
    setWeightType(value);
  };

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];
    const newFoodData = { ...data, image, weightType };
    if (isEditSession) {
      mutateEdit({ newFoodData, id: editId });
    } else {
      mutateCreate(newFoodData);
    }
  }

  return (
    <div className="formContainer">
      {isEditSession && <p onClick={() => setShowForm(false)} className="closeForm"><i className="fa-regular fa-circle-xmark"></i></p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input foodName">
          <label htmlFor="foodName">Food Name</label>
          <input
            type="text"
            name="foodName"
            id="foodName"
            disabled={isWorking}
            placeholder="Enter Food Name"
            {...register("foodName")}
          />
        </div>
        <div className="input foodPrice">
          <label htmlFor="foodPrice">Food Price</label>
          <input
            type="number"
            name="foodPrice"
            id="foodPrice"
            disabled={isWorking}
            placeholder="Enter Food Price"
            {...register("foodPrice")}
          />
        </div>
        <div className="input maxQuantity">
          <label htmlFor="maxQuantity">Food Quantity</label>
          <input
            type="number"
            name="maxQuantity"
            id="maxQuantity"
            disabled={isWorking}
            placeholder="Enter Food maxQuantity"
            {...register("maxQuantity")}
          />
        </div>
        <div className="input foodImage">
          <label htmlFor="image">Food Image</label>
          <input
            type="file"
            name="image"
            required={!isEditSession}
            id="image"
            disabled={isWorking}
            placeholder="Add Food Image"
            {...register("image")}
          />
        </div>
        <div className="input weightType">
          <label>Type</label>
          <div>
            <label>
              <input
                type="radio"
                name="weightType"
                required
                value="kg"
                checked={weightType === 'kg'}
                onChange={() => handleWeightTypeChange('kg')}
                disabled={isWorking}
              />
              Kg
            </label>
            <label>
              <input
                type="radio"
                name="weightType"
                value="piece"
                required
                checked={weightType === 'piece'}
                onChange={() => handleWeightTypeChange('piece')}
                disabled={isWorking}
              />
              Piece
            </label>
          </div>
        </div>
        <input
          className="foodAddBtn"
          type="submit"
          value={isWorking ? <Spinner /> : (isEditSession ? "Save Changes" : 'Add Food')}
          disabled={isWorking}
        />
      </form>
    </div>
  );
};

export default FoodAddForm;
