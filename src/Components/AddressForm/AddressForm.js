import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getCurrentUserId, updateUser } from "../../Services/apiUsers";
import './addressForm.css'

const AddressForm = ({ setAddressAdded, userDetails, setIsEditing, onAddressUpdated }) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn:  updateUser,
    onSuccess: () => {
      toast.success("Information updated successfully");
      reset();
      setIsEditing(false)
      setAddressAdded(true);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onAddressUpdated()
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: userDetails || {},
  });

  const onSubmit = (newData) => {
    const userId = getCurrentUserId();
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    if (newData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits long.");
      return;
    }

    mutate({ newData, id: userId });
  };

  return (
    <div className="addressFormContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="head">Billing Address</p>
        <div className="col1">
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="FIRST NAME"
            {...register("firstName", { required: true })}
          />
          
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="LAST NAME"
            {...register("lastName", { required: true })}
          />
        </div>
        <div className="col2">
          <input
            type="email"
            name="personalEmail"
            id="personalEmail"
            placeholder="YOUR EMAIL"
            {...register("personalEmail", { required: true })}
          />
          
          <input
            type="number"
            name="phone"
            id="phone"
            placeholder="YOUR PHONE NUMBER"
            {...register("phone", { required: true })}
          />
        </div>
        <textarea
          name="address"
          id="address"
          placeholder="ADDRESS"
          {...register("address", { required: true })}
        ></textarea>

        <input className="submitBtn" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddressForm;
