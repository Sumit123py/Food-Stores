import React from "react";
import { createEditFood } from "../../Services/apiFood";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import './foodAddForm.css'
const FoodAddForm = ({ foodToEdit = {}, setCurrentAction, setShowForm }) => {
  const queryClient = useQueryClient();




  const { mutate: mutateCreate, isCreating } = useMutation({
    mutationFn: createEditFood,
    onSuccess: () => {
      toast.success("New Food created successfully");

      queryClient.invalidateQueries({
        queryKey: ["foods"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: mutateEdit, isEditing } = useMutation({
    mutationFn: ({ newFoodData, id }) => createEditFood(newFoodData, id),
    onSuccess: () => {
      toast.success("Food Edited successfully");
      setCurrentAction('dashboard')
      reset(); 
      setShowForm(false)
      queryClient.invalidateQueries({
        queryKey: ["foods"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  const isWorking = isCreating || isEditing;

  

  const { id: editId, ...editValues } = foodToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0]
    if(isEditSession) mutateEdit({newFoodData: {...data, image}, id: editId})
    else mutateCreate({ ...data, image: image });


  }

  
  return (
    <div className="formContainer">
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
            type="Number"
            name="foodPrice"
            id="foodPrice"
            disabled={isWorking} 
            placeholder="Enter Food Price"
            {...register("foodPrice")}
          />
        </div>
        <div className="input maxQuantity">
          <label htmlFor="foodPrice">Food Quantity</label>
          <input
            type="Number"
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
            required={isEditSession ? false : "This field is required"}
            id="image"
            disabled={isWorking} 
            placeholder="Add Food Image" 
            {...register("image")}
          />
        </div>
        <div className="input foodIngredients">
          <label htmlFor="ingredients">Food Ingredients</label>
          <input
            type="text"
            name="ingredients"
            id="ingredients"
            disabled={isWorking} 
            placeholder="Add Food Ingredients"
            {...register("ingredients")}
          />
        </div>
        <input
          className="foodAddBtn"
          type="submit"
          
          value={isEditSession ? "Save Changes" : "Add Food"}
          disabled={isWorking}
        />
      </form>
    </div>
  );
};

export default FoodAddForm;
