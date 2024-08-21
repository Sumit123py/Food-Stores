import React, { useContext, useState, useEffect } from 'react';
import { deleteCart, getCart } from '../../../Services/apiCart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../../spinLoader/Spinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createOrder, createDuplicateOrder } from '../../../Services/apiOrders';
import OrderButton from '../../../OrderButton/OrderButton';
import { getCurrentUserId, getUser } from '../../../Services/apiUsers';
import { ProductContext } from '../../../context/FoodContext';
import  supabase  from '../../../Services/Supabase'; // Assuming you have a supabase client instance
import './table.css';
import useSupabaseRealtime from '../../../Services/useSupabaseRealtime';
import { getFood } from '../../../Services/apiFood';
import OrderPreparingMessage from '../../OrderPreparingMessage/OrderPreparingMessage';

const Table1 = ({ addressAdded }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setOrderData, setTotalItem } = useContext(ProductContext);

  useSupabaseRealtime('Orders', 'Orders')

  useSupabaseRealtime('cart', 'carts')

  const userId = getCurrentUserId()

  const { isLoading: userLoading, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const [closeReadyMessage, setCloseReadyMessage] = useState(false)
  const [selectedWeights, setSelectedWeights] = useState({});


  const currentUser = users?.filter(
    (user) => user?.id === userId
  );

  const admin = users?.filter((user) => user.role === 'admin')

  const adminUser = admin?.[0]
  const user = currentUser?.[0];

  // const [selectedPrices, setSelectedPrices] = useState(null)


  const sendNotification = async () => {
    // Obtain the token from local storage or another source
    console.log('FCM Token:', adminUser?.fcm_token);
    
    if (!adminUser?.fcm_token) {
      console.error('FCM token not found');
      return;
    }
    
    try {
      const response = await fetch(`https://shivaaysweets.vercel.app/api/send-message?title=New Order&body=You have a new order to check`, {
        method: 'GET', // Use 'POST' if your server expects a POST request
        headers: {
          'Content-Type': 'application/json',
          'x-fcm-token': adminUser?.fcm_token 
        }
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Server Response:', data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  


  const IncreaseQuantity = async (productId, maxQuantity, cartId, weight) => {
    const foodItem = await getFood(cartId);

    let selectedPrices 

  if(weight === '250 Grams'){
    selectedPrices = 0.25
  }
  else if(weight === '500 Grams'){
    selectedPrices = 0.5
  }
  else if(weight === '1 kg'){
    selectedPrices = 1
  }

    if (maxQuantity < foodItem.maxQuantity) {
      try {
        const newQuantity = maxQuantity + 1;
        const totalPrice = newQuantity * (foodItem.foodPrice * selectedPrices) 

        const { error } = await supabase
          .from('cart')
          .update({
          maxQuantity: newQuantity,
          totalPrice: totalPrice })
          .eq('id', productId);

        if (error) {
          console.error('Error updating maxQuantity:', error);
          toast.error('Error updating maxQuantity');
        } else {
          queryClient.setQueryData(['carts'], oldData =>
            oldData.map(item =>
              item.id === productId ? { ...item, maxQuantity: newQuantity, totalPrice: totalPrice } : item
            )
          );
        }

      } catch (error) {
        console.error('Error increasing maxQuantity:', error);
      }
    }
  };



  const DecreaseQuantity = async (productId, maxQuantity, cartId, weight) => {
    const foodItem = await getFood(cartId);

    let selectedPrices 

  if(weight === '250 Grams'){
    selectedPrices = 0.25
  }
  else if(weight === '500 Grams'){
    selectedPrices = 0.5
  }
  else if(weight === '1 kg'){
    selectedPrices = 1
  }

    if (maxQuantity > 1) {
      try {
        const newQuantity = maxQuantity - 1;
        const totalPrice = newQuantity * (foodItem.foodPrice * selectedPrices) 

        const { error } = await supabase
          .from('cart')
          .update({ 
          maxQuantity: newQuantity,
          totalPrice: totalPrice })
          .eq('id', productId);

        if (error) {
          console.error('Error updating maxQuantity:', error);
          toast.error('Error updating maxQuantity');
        } else {
          queryClient.setQueryData(['carts'], oldData =>
            oldData.map(item =>
              item.id === productId ? { ...item, maxQuantity: newQuantity, totalPrice: totalPrice } : item
            )
          );
        }
      } catch (error) {
        console.error('Error decreasing maxQuantity:', error);
      }
    }
  };
  

  const { isLoading, data: cart, error, refetch } = useQuery({
    queryKey: ['carts'],
    queryFn: getCart,
  });





  

  const fetchCart = cart?.filter((cartItem) => cartItem.userId === userId)

  const sortedFetchCart = fetchCart?.sort((a, b) => a.id - b.id);


  const { isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      toast.success('Item ordered')
      queryClient.invalidateQueries({ queryKey: ['carts'] });
      
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });


  const { mutate: mutateCreate, isLoading: isCreating } = useMutation({
    mutationFn: ({ userId, cartItems }) => createOrder(userId, cartItems), 
    onSuccess: async () => {
      toast.success("Order placed successfully");
      queryClient.invalidateQueries({ queryKey: ['Orders'] });
      handleUpdate();
      setCloseReadyMessage(true)

      try {
        await Promise.all(
          fetchCart?.map((cartItem) => mutateDelete(
            cartItem.userId, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['Orders'] });
              sendNotification()
            },
            onError: (err) => {
              console.error('Error deleting cart item:', err);
              toast.error(err.message);
            },
          }))
        );
      } catch (err) {
        console.error('Error deleting items from the cart:', err);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const {mutate: mutateCreateDuplicateOrder, isLoading: duplicateCreating} = useMutation({
    mutationFn: ({userId, cartItems}) => createDuplicateOrder(userId, cartItems),
    onSuccess: async () => {

      queryClient.invalidateQueries({queryKey: ['Orders_duplicate']})
    },
    onError: (err) => toast.error(err.message)
  })

  function handleUpdate() {
    refetch();
  }



  const handleAddOrder = async () => {

    if (cart && cart.length > 0) {
      const cartItems = cart.filter((item) => item.userId === userId);
      if (userId) {
        await decreaseMaxQuantity(cartItems);
        await mutateCreate({ userId, cartItems });
        await mutateCreateDuplicateOrder({ userId, cartItems });
      } else {
        toast.error('User not logged in');
      }
    } else {
      toast.error('Cart is empty');
    }
  };

  const decreaseMaxQuantity = async (cartItems) => {
    try {
      await Promise.all(
        cartItems.map(async (cartItem) => {
          const foodItem = await getFood(cartItem.cartId);
          if (foodItem.maxQuantity > 0) {
            const newMaxQuantity = foodItem.maxQuantity - cartItem.maxQuantity;

            const { error } = await supabase
              .from('Food')
              .update({ maxQuantity: newMaxQuantity })
              .eq('id', cartItem.cartId);

            if (error) {
              console.error('Error updating maxQuantity in Food table:', error);
              toast.error('Error updating maxQuantity in Food table');
            }
          }
        })
      );
    } catch (error) {
      console.error('Error decreasing maxQuantity in Food table:', error);
    }
  };
        
  const handleBtnClick = () => {
    toast.error('Please Fill The Form');
  };

  if (isLoading) return <Spinner />;

  return (
    <>
    {closeReadyMessage && <OrderPreparingMessage setCloseReadyMessage={setCloseReadyMessage}/>}
    <div className="table1">
      <div className="column1">
        <p>Product</p>
        <p>Item In</p>
        <p>Quantity</p>
        <p>Subtotal</p>
        <p>Remove</p>
      </div>
      {sortedFetchCart?.map((cartItem) => {
        const productId = cartItem.id;

        return (
          <div key={productId} className="column2">
            <div className="productImage">
              <img src={cartItem.image} alt={cartItem.foodName} />
            </div>
            <p className="productPrice">{cartItem.weight}</p>
            <div className="quantity">
              <div className="quantityBox">
                <div className="btns">
                  <p onClick={() => DecreaseQuantity(productId, cartItem.maxQuantity, cartItem.cartId, cartItem.weight)} className="decQuantity">
                    -
                  </p>
                  <p>{cartItem.maxQuantity}</p>
                  <p onClick={() => IncreaseQuantity(productId, cartItem.maxQuantity, cartItem.cartId, cartItem.weight)} className="incQuantity">
                    +
                  </p>
                </div>
              </div>
            </div>
            <div className="subtotal">
              <p>₹{cartItem.totalPrice}</p>
            </div>
            <p className="remove">
              <i
                disabled={isDeleting}
                onClick={() => mutateDelete(cartItem.id)}
                className="fa-solid fa-circle-xmark"
              ></i>
            </p>
          </div>
        );
      })}
      <div className="column3">
        {fetchCart?.length > 0 && user?.address && <OrderButton addressAdded={addressAdded} isCreating={isCreating} onClick={handleAddOrder} cart={cart} />}
        {fetchCart?.length <= 0 && <button onClick={() => {
          setOrderData(userId);
          navigate('/orderMain');
        }} className="yourOrders">
          your orders
        </button>}
        {!user?.address && fetchCart?.length > 0 && <button className='completeOrderBtn' onClick={handleBtnClick}>Complete Order</button>}
        <button
          onClick={() => navigate(-1)}
          className="updateBtn">
          Update Cart
        </button>
      </div>
    </div>
    </>
  );
};

export default Table1;
