import React, { useContext, useState } from 'react';
import { deleteCart, getCart } from '../../../Services/apiCart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../../spinLoader/Spinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../../Services/apiOrders';
import OrderButton from '../../../OrderButton/OrderButton';
import { getCurrentUserId } from '../../../Services/apiUsers';
import { ProductContext } from '../../../context/FoodContext';
import './table.css'

const Table1 = ({addressAdded}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [QuantityData, setQuantityData] = useState({});
  const { setOrderData, setTotalItem } = useContext(ProductContext)

  const IncreaseQuantity = (productId, maxQuantity, foodName) => {
    setQuantityData((prev) => {
      const currentQuantity = prev[productId] || 1;
      const newQuantity = currentQuantity + 1;
      if (newQuantity > maxQuantity) {
        toast.error(`There are ${maxQuantity} ${foodName} in store`);
        return prev; 
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const DecreaseQuantity = (productId) => {
    setQuantityData((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) - 1, 0),
    }));
  };

  const { isLoading, data: cart, error, refetch } = useQuery({
    queryKey: ['carts'],
    queryFn: getCart,
  });

  const { isDeleting, mutate } = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] });
      setTotalItem(null)
      refetch()
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: mutateCreate, isLoading: isCreating } = useMutation({
    mutationFn: ({ userId, cartItems }) => createOrder(userId, cartItems),
    onSuccess: async () => {
      toast.success("Order placed successfully");
      queryClient.invalidateQueries({ queryKey: ['Orders'] });
      handleUpdate()

      try {
        await Promise.all(
          cart.map((cartItem) => mutate(cartItem.id, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['Orders'] });
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

  function handleUpdate() {
    refetch()
  }

  const handleAddOrder = () => {
    if (cart && cart.length > 0) {
      const cartItems = cart.map(cartItem => ({
        ...cartItem,
        maxQuantity: QuantityData[cartItem.id] || 1,
        totalPrice: cartItem.foodPrice * (QuantityData[cartItem.id] || 1),
      }));
      const userId = getCurrentUserId();
      if (userId) {
        mutateCreate({ userId, cartItems });
      } else {
        toast.error('User not logged in');
      }
    } else {
      toast.error('Cart is empty');
    }
  };

  const handleBtnClick = () => {
    toast.error('Please Fill The Form')
}

  if (isLoading) return <Spinner />;

  return (
    <div className="table1">
      <div className="column1">
        <p>Product</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Subtotal</p>
        <p>Remove</p>
      </div>
      {cart?.map((cartItem) => {
        const productId = cartItem.id;
        const quantity = QuantityData[productId] || 1;

        return (
          <div key={productId} className="column2">
            <div className="productImage">
              <img src={cartItem.image} alt={cartItem.foodName} />
            </div>
            <p className="productPrice">₹{cartItem.foodPrice}</p>
            <div className="quantity">
              <div className="quantityBox">
                <p>{quantity}</p>
                <div className="btns">
                  <button onClick={() => IncreaseQuantity(productId, cartItem.maxQuantity, cartItem.foodName)} className="incQuantity">
                    <i className="fa-solid fa-caret-up caret"></i>
                  </button>
                  <button onClick={() => DecreaseQuantity(productId)} className="decQuantity">
                    <i className="fa-solid fa-caret-down caret"></i>
                  </button>
                </div>
              </div>
            </div>
            <p className="subtotal">
              ₹{Number(cartItem.foodPrice) * quantity}.00
            </p>
            <p className="remove">
              <i
                disabled={isDeleting}
                onClick={() => mutate(cartItem.id)}
                className="fa-solid fa-circle-xmark"
              ></i>
            </p>
          </div>
        );
      })}
      <div className="column3">
        {cart.length > 0 && addressAdded && <OrderButton addressAdded={addressAdded} isCreating={isCreating} onClick={handleAddOrder} cart={cart}/>}
        {cart.length <= 0 && <button onClick={() => {
          setOrderData(getCurrentUserId())
          navigate('/orderMain')
          }} className="yourOrders">
          your orders
        </button>}
        {!(addressAdded || cart.length <= 0) && <button className='completeOrderBtn' onClick={handleBtnClick}>Complete Order</button>}
        <button
         onClick={() => navigate(-1)}
         className="updateBtn">
          Update Cart
        </button>
      </div>
    </div>
  );
};

export default Table1;
