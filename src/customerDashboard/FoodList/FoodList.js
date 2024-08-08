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
import { getCurrentUserId, getCurrentUserShortID, getUser } from '../../Services/apiUsers';
import LottieIcon from '../../Components/LottieIcon';
const FoodList = ({searchData, setTitle, setMaxQuantity, setShowCartPopUp}) => {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUser(),
  });

  const navigate = useNavigate()

  const { totalItem, setTotalItem, setFoodItemId, setFoodPrice, setPrice, type, setType, weight, setWeight } = useContext(ProductContext)

  useSupabaseRealtime('Food', 'foods')


  const queryClient = useQueryClient();

  const { isLoading, data: food, error } = useQuery({
    queryKey: ['foods'],
    queryFn: () => getFood()
  });


  const UserID = getCurrentUserId()
  const userShortID = users?.find((user) => user.id === UserID)
  const ShortID = userShortID?.userShortID



  const handleCartPopUp = (id, title, maxQuantity, price, weightType) => {
    setTitle(title)
    setFoodItemId(id)
    setShowCartPopUp(true)
    setMaxQuantity(maxQuantity)
    setFoodPrice(price)
    setPrice(weightType === 'kg' ? price * 0.25 : price)
    setType(weightType)
    setWeight(weightType === 'kg' ? '250 Grams' : 'Piece')
    
  }

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

  
  
  const handleCart = async (id, userId, shortID) => {
    try {
      const cartItems = await getCart();
      const isItemInCart = cartItems.some(item => (item.cartId === id && item.userId === userId));

      if (isItemInCart) {
        toast.success(`Item is already in cart, Check Cart`);
        return;
      }

      const foodItem = await getFood(id);
      if (foodItem.maxQuantity === 0) {
        toast.error('Sorry, this food is not available');
        return;
      }
      mutateCreate({foodItem, userId, shortID});

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
            <div disabled={isCreating} onClick={() => handleCart(foodItem.id, UserID, ShortID)} className='cartBtn'>
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

    {/* second */}

    <div className='foodListContainerMobile'>
      <div className="foodContainer">
      {filterValue?.map((foodItem) => (
        <div key={foodItem.id} className="foodCard">
          <div id='image' className="img">
            <img src={foodItem.image} alt="" />
          </div>
          <div className="details">
          <p id='foodName' className="foodName">{foodItem.foodName}</p>
          <p style={{color: 'grey'}} className="noOfProducts">
            Total: <span style={{color: 'black'}}>{foodItem.maxQuantity} {foodItem.weightType}</span>
          </p>
           
                        
          </div>
          <div className="price cart">
          <p id='foodPrice' className="foodPrice">₹{foodItem.weightType === 'kg' ? foodItem.foodPrice * 0.25 : foodItem.foodPrice}</p>
          <div disabled={isCreating} onClick={() => handleCartPopUp(foodItem.id, foodItem.foodName, foodItem.maxQuantity, foodItem.foodPrice, foodItem.weightType)} className='cartBtn'>
              <LottieIcon/>
              <p className='cartIcon'>ADD</p>
              {/* {!isCreating && <p>Add</p>} */}
              {/* {isCreating && <Spinner/>} */}
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
</>
    
  );
};

export default FoodList;
