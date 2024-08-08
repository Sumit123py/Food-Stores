import React, { useState } from "react";
import Table1 from "./table/Table1";
import AddressForm from "../AddressForm/AddressForm";
import { getCurrentUserId, getUser } from "../../Services/apiUsers";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../spinLoader/Spinner";
import './cart.css'
import Table2 from "./table/Table2";
import { getCart } from "../../Services/apiCart";

import { getAppSetting } from "../../Services/apiAppSetting";
import useSupabaseRealtime from "../../Services/useSupabaseRealtime";
const Cart = () => {

  useSupabaseRealtime('appSetting', 'appSettings')

  const userId = getCurrentUserId()

  const { isLoading, data: users, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const {isLoading: cartLoading, data: cart } = useQuery({
    queryKey: ['carts'],
    queryFn: getCart,
  });

  const {isLoading: appSettingLoading, data: appSetting } = useQuery({
    queryKey: ['appSettings'],
    queryFn: getAppSetting,
  });

  const isDelivery = appSetting?.[0].isDeliveryAvailable

  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(isDelivery)

  const cartItems = cart?.filter((item) => item.userId === userId)

  const currentUser = users?.filter(
    (user) => user?.id === userId
  );

  const user = currentUser?.[0];


  const [addressAdded, setAddressAdded] = useState(user ? true : false)
  const [isEditing, setIsEditing] = useState(false)

  


  const handleAddressUpdated = () => {
    setAddressAdded(true);
    setIsEditing(false);
    refetch();
  };

  isLoading && <Spinner/>


  
  return (
    <div className="cart">
      <div className="cartContainer">
      {/* <Message appSetting={appSetting}/> */}

      {(!user?.address  || isEditing) &&  <AddressForm setAddressAdded={setAddressAdded} userDetails={user} setIsEditing={setIsEditing} onAddressUpdated={handleAddressUpdated}/>}
      {user && 
      (<div className="userDetailsContainer">

        <div className="details">

          <div className="about">
            <p>Deliver to: <span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{user?.firstName}  {user?.lastName}</span> </p>
          </div>

          <p className="address">

            {user?.address}

          </p>

        </div>
        <button onClick={() => setIsEditing(true)} className="editBtn">Change</button>
        
      </div>)}

      <Table1 addressAdded={addressAdded}/>
      {cartItems?.length > 0 && <Table2 cartItems={cartItems} cartLoading={cartLoading} appSetting={appSetting}/>}
      </div>
    </div>
  );
};

export default Cart;
