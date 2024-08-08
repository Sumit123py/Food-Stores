import React, { useContext, useState } from "react";
import "./weightSelection.css";
import { getCurrentUserId, getUser } from "../../Services/apiUsers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabaseRealtime from "../../Services/useSupabaseRealtime";
import { getFood } from "../../Services/apiFood";
import { getCart, insertCart } from "../../Services/apiCart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/FoodContext";
import supabase from "../../Services/Supabase";
const WeightSelection = ({
  maxQuantity,
  title,
  showCartPopUp,
  setShowCartPopUp,
}) => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUser(),
  });

  const queryClient = useQueryClient();

  const { foodItemId, foodPrice, price, setPrice, type, weight, setWeight } = useContext(ProductContext);


  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);


  const navigate = useNavigate();

  useSupabaseRealtime("cart", "carts");

  const UserID = getCurrentUserId();
  const userShortID = users?.find((user) => user.id === UserID);
  const ShortID = userShortID?.userShortID;

  const { mutate: mutateCreate, isCreating } = useMutation({
    mutationFn: insertCart,
    onSuccess: () => {
      toast.success("Food added to cart successfully");

      queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCart = async (id, userId, shortID) => {
    try {
      const cartItems = await getCart();
      const isItemInCart = cartItems.some(
        (item) => item.cartId === id && item.userId === userId
      );
  
      if (isItemInCart) {
        toast.success(`Item is already in cart, Check Cart`);
        return;
      }
  
      const foodItem = await getFood(id);
      if (foodItem.maxQuantity === 0) {
        toast.error("Sorry, this food is not available");
        return;
      }
  
      // Update the cart item with the new quantity and price
      const updatedCartItem = {
        ...foodItem,
        maxQuantity: quantity,
        totalPrice: price * quantity,
        weight: weight
      };

      console.log(updatedCartItem)

      mutateCreate({ foodItem: updatedCartItem, userId, shortID });
  
      toast.success("Food Added to Cart Successfully");
      navigate("/cart");
    } catch (error) {
      toast.error("Error adding item to cart");
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleCloseCartPopUp = () => {
    setShowCartPopUp(false)
    setPrice(foodPrice * 0.25)
    setQuantity(1)
    setActive(0)
  }

  const price1 = type === 'kg' ? foodPrice * 0.25 : foodPrice
  const price2 = type === 'kg' ? foodPrice * 0.5 : foodPrice * 2
  const price3 = type === 'kg' ? foodPrice : foodPrice * 3

  const type1 = type === 'kg' ? '250 Grams' : '1 piece'
  const type2 = type === 'kg' ? '500 Grams' : '2 piece'
  const type3 = type === 'kg' ? '1 kg' : '3 piece'

  return (
    <div style={{opacity: showCartPopUp ? '1' : '0', visibility: showCartPopUp ? 'visible' : 'hidden'}} className="weightSelectionContainer">
      <div className="weightSelection">
        <p onClick={handleCloseCartPopUp} className="closeIcon">
          <i class="fa-solid fa-circle-xmark"></i>
        </p>

        <div style={{height: showCartPopUp ? '400px' : '0'}} className="selectQuantity">
          <div className="top">
            <p className="title">{title}</p>
          </div>
          <div className="quantity">
            <div className="head">
              <p className="title">Quantity</p>
              <p className="para">
                <span>Required</span>
                <span className="point"></span>
                <span>Select any 1 option</span>
              </p>
            </div>
            <div className="select">
              <div
                style={{ fontWeight: active === 0 ? "700" : "400" }}
                onClick={() => {
                  setActive(0);
                  setPrice(price1);
                  setQuantity((prev) => type === 'kg' ? prev : prev = 1)
                  setWeight(type === 'kg' ? '250 Grams' : 'piece')
                }}
                className="option"
              >
                <p>{type1}</p>
                <div className="price">
                  <p>₹{price1}</p>
                  <p className="outerCircle">
                    <span 
                      style={{ display: active === 0 ? "flex" : "none" }}
                      className="innerCircle"
                    ></span>
                  </p>
                </div>
              </div>
              <div
                style={{ fontWeight: active === 1 ? "700" : "400" }}
                onClick={() => {
                  setActive(1);
                  setPrice(price2);
                  setQuantity((prev) => type === 'kg' ? prev : prev = 2)
                  setWeight(type === 'kg' ? '500 Grams' : 'piece')

                }}
                className="option"
              >
                <p>{type2}</p>
                <div className="price">
                  <p>₹{price2}</p>
                  <p className="outerCircle">
                    <span
                      style={{ display: active === 1 ? "flex" : "none" }}
                      className="innerCircle"
                    ></span>
                  </p>
                </div>
              </div>
              <div
                onClick={() => {
                  setActive(2);
                  setPrice(price3);
                  setQuantity((prev) => type === 'kg' ? prev : prev = 3)
                  setWeight(type === 'kg' ? 'kg' : 'piece')
                }}
                style={{ fontWeight: active === 2 ? "700" : "400" }}
                className="option"
              >
                <p>{type3}</p>
                <div className="price">
                  <p>₹{price3}</p>
                  <p className="outerCircle">
                    <span
                      style={{ display: active === 2 ? "flex" : "none" }}
                      className="innerCircle"
                    ></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="addToCart">
            <div className="changeQuantity">
              <p onClick={handleDecreaseQuantity} style={{ color: "red" }}>
                -
              </p>
              <p>{quantity}</p>
              <p onClick={handleIncreaseQuantity} style={{ color: "red" }}>
                +
              </p>
            </div>
            <button
              disabled={isCreating}
              onClick={() => handleCart(foodItemId, UserID)}
              className="addToCartButton"
            >
              Add item <span>₹{price * quantity}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightSelection;
