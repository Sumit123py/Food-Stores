import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getUserByEmail, getCurrentUserId } from '../Services/apiUsers';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ProductContext } from '../context/FoodContext';
import './form.css';
import Spinner from '../spinLoader/Spinner';
import supabase from '../Services/Supabase';

const Login = () => {
  const navigate = useNavigate();
  const { setEmail, email, setPassword, password, handleLogin, fcmToken} = useContext(ProductContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const userId = getCurrentUserId()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: async (response) => {
      try {
        const userData = await getUserByEmail(email);
        if (userData) {
          handleLogin(response.session.access_token, email); // Assuming response contains the token
          navigate('/dashboard');
        } else {
          navigate('/Unauthorized');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch user data');
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if email and password are provided
    if (!email || !password) return;
    
    // Call the mutation function
    await mutate({ email, password });
  
    try {
      // Update the user with the FCM token
      const { error: userError } = await supabase
        .from("users")
        .update({ fcm_token: fcmToken })
        .eq("id", userId);
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      // Handle success (optional)
      console.log("FCM token updated successfully");
    } catch (error) {
      // Handle the error
      console.error("Error updating FCM token:", error);
    }
  };
  

  return (
    <div className="loginContainer">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form className="authForm" onSubmit={handleSubmit}>
        <h3>Login Here</h3>
        <label htmlFor="username">Email</label>
        <input
        className='authInput'
          value={email}
          onChange={handleEmailChange}
          name="email"
          id="email"
          type="email"
          required
          autoComplete="off"
          disabled={isLoading}
        />

        <label htmlFor="password">Password</label>
        <input
        className='authInput'
          value={password}
          onChange={handlePasswordChange}
          name="password"
          id="password"
          type="text"
          required
          autoComplete="off"
          disabled={isLoading}
        />

        <button disabled={isLoading} type="submit">{isLoading ? <Spinner/> : 'Log In'}</button>
      <p onClick={() => navigate('/')}>Create Account</p>

      </form>
    </div>
  );
};

export default Login;
