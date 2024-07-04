import React, { useContext } from 'react';
import { getFood } from '../../Services/apiFood';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductContext } from '../../context/FoodContext'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../../spinLoader/Spinner';
import { getCart, insertCart } from '../../Services/apiCart';
import './foodList.css'
import useSupabaseRealtime from '../../Services/useSupabaseRealtime';
import { getCurrentUserId } from '../../Services/apiUsers';
const FoodList = ({searchData}) => {

  const navigate = useNavigate()

  const { totalItem, setTotalItem } = useContext(ProductContext)

  useSupabaseRealtime('Food', 'foods')
  useSupabaseRealtime('cart', 'carts')


  const queryClient = useQueryClient();

  const { isLoading, data: food, error } = useQuery({
    queryKey: ['foods'],
    queryFn: () => getFood()
  });


  const UserID = getCurrentUserId()


  const { mutate: mutateCreate, isCreating } = useMutation({
    mutationFn: insertCart,
    onSuccess: () => {
      toast.success("Food added to cart successfully");

      queryClient.invalidateQueries({
        queryKey: ['carts'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCart = async (id, userId) => {
    try {
      const cartItems = await getCart();
      const isItemInCart = cartItems.some(item => (item.cartId === id && item.userId === userId));

      if (isItemInCart) {
        toast.success(`Item is already in cart, Check Cart`);
        return;
      }

      const foodItem = await getFood(id);
      console.log('uods', userId)
      mutateCreate({foodItem, userId});
      toast.success("Food Added to Cart Successfully");
      navigate('/cart');
      setTotalItem(prevTotalItem => prevTotalItem + 1);
      localStorage.setItem('totalItem', totalItem + 1);
    } catch (error) {
      toast.error('Error adding item to cart');
    }
  };



  let filterValue 

  if(searchData){
    filterValue = food?.filter((foodItem) => foodItem.foodName.toLowerCase().includes(searchData))
  }
  else{
    filterValue = food
  }

  return (

    <>

    <div className='foodListContainer'>
 { isLoading && <Spinner/>}

      {filterValue && <div className="foodContainer">

      {filterValue?.map((foodItem) => (
        <div key={foodItem.id} className="foodCard">
          <div id='image' className="img">
            <img src={foodItem.image} alt="" />
          </div>
          <div className="details">
            <div disabled={isCreating} onClick={() => handleCart(foodItem.id, UserID)} className='cartBtn'>
              <p><i className="fa-solid fa-cart-shopping" style={{ color: "#ffffff" }}></i></p>
              <p >Add To Cart</p>
            </div>
            <p id='foodPrice' className="foodPrice">₹{foodItem.foodPrice}</p>
            <p id='foodName' className="foodName">{foodItem.foodName}</p>
            <p id='ingredients' className="ingredients">{foodItem.ingredients}</p>
          </div>
        </div>
      ))}
      </div>}
    </div>

    {/* // second */}

    <div className='foodListContainerMobile'>
      <div className="foodContainer">
      {filterValue?.map((foodItem) => (
        <div key={foodItem.id} className="foodCard">
          <div id='image' className="img">
            <img src={foodItem.image} alt="" />
          </div>
          <div className="details">
          <p id='foodName' className="foodName">{foodItem.foodName}</p>
            <p id='foodPrice' className="foodPrice">₹{foodItem.foodPrice}</p>
                        
          </div>
          <div disabled={isCreating} onClick={() => handleCart(foodItem.id, UserID)} className='cartBtn'>
              <p className='cartIcon'><i className="fa-solid fa-cart-shopping" ></i></p>
              <p >Add</p>
            </div>
        </div>
      ))}
      </div>
    </div>
</>
    
  );
};

export default FoodList;
