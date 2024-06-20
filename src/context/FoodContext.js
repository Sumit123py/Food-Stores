import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserByEmail } from '../Services/apiUsers';
import { useNavigate } from 'react-router-dom';

const ProductContext = createContext(null);

export const useAuth = () => useContext(ProductContext);

const ProductProvider = ({ children }) => {
  const [totalItem, setTotalItem] = useState(null);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [orderData, setOrderData] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  



  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // Assume validateToken API call validates the token and returns user data if valid
          const userData = await getUserByEmail(email);
          if (userData) {
            setUserRole(userData.role);
          } else {
            handleLogout(); // Invalid token, log out the user
          }
        } catch (error) {
          console.error('Failed to validate token', error);
          handleLogout(); // Error in validation, log out the user
        }
      }
    };
    validateToken();
  }, [token, email]);



  const handleEmailChange = (newEmail) => {
    localStorage.removeItem('userEmail');
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
  };

  const handleLogin = (newToken, userEmail) => {
    setToken(newToken);
    setEmail(userEmail);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', userEmail);
  };

  const handleLogout = () => {
    setEmail('');
    setPassword('');
    setToken(null);
    setUserRole('');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
  };

  return (
    <ProductContext.Provider
      value={{
        setTotalItem,
        totalItem,
        subTotalPrice,
        setSubTotalPrice,
        email,
        setEmail: handleEmailChange,
        password,
        setPassword,
        userRole,
        orderData,
        setOrderData,
        token,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductProvider, ProductContext };
