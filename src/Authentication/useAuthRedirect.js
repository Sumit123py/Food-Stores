import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/FoodContext';

const useAuthRedirect = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole) {
      navigate('/dashboard');
    }
  }, [userRole]);
};

export default useAuthRedirect;