import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser } from "../Services/apiUsers";
import toast from "react-hot-toast";
import "./form.css";
import Spinner from "../spinLoader/Spinner";
const Registration = () => {
  const queryClient = useQueryClient();
  
  const Navigate = useNavigate();

  const { mutate, isLoading: isCreating } = useMutation(createUser, {
    onSuccess: () => {
      toast.success("New User Created Successfully");
      queryClient.invalidateQueries("users");
      Navigate("/Login");
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="registrationContainer">
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
      </div>

      <form className="authForm" onSubmit={handleSubmit(onSubmit)}>
        <h3>Register Here</h3>
        <label for="username">Email</label>
        <input
          name="email"
          id="email"
          type="email"
          required
          autoComplete="off"
          {...register("email")}
        />

        <label for="password">Password</label>
        <input
          name="password"
          id="password"
          type="password"
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
  );
};

export default Registration;
