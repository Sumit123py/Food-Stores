import React, { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser } from "../Services/apiUsers";
import toast from "react-hot-toast";
import "./form.css";
import Spinner from "../spinLoader/Spinner";
import { ProductContext } from "../context/FoodContext";
import FCMInitializer from "../features/notifications/firebase";
const Registration = () => {
  const queryClient = useQueryClient();

  const {fcmToken} = useContext(ProductContext)

  
  const Navigate = useNavigate();

  const { mutate, isLoading: isCreating } = useMutation(createUser, {
    onSuccess: () => {
      toast.success("New User Created Successfully");
      queryClient.invalidateQueries("users");
      Navigate("/Login");
    },
    onError: (err) => toast.error('password must be atleast 7 Characters'),
  });

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const userData = {
      ...data,
      fcmToken,
    };
    mutate(userData);
  };

  return (
    <>
    <FCMInitializer/>

    <div className="registrationContainer">
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
      </div>

      <form className="authForm" onSubmit={handleSubmit(onSubmit)}>
        <h3>Register Here</h3>
        <label for="username">Email</label>
        <input
        className='authInput'

          name="email"
          id="email"
          type="email"
          required
          autoComplete="off"
          {...register("email")}
        />

        <label for="password">Password</label>
        <input
        className='authInput'

          name="password"
          id="password"
          type="text"
          required
          autoComplete="off"
          {...register("password")}
        />

        <button type="submit" disabled={isCreating}>{isCreating ? <Spinner/> : 'Signup'}</button>
        <div className="login">
          <p>Already have an account</p>
          <button onClick={() => Navigate('/Login')}>Login</button>
          </div>
      </form>
      
    </div>
    </>
  );
};

export default Registration;
