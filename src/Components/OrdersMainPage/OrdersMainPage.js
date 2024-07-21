import React, { useContext, useEffect, useState } from "react";
import { getOrders, updateDuplicateOrder, updateOrder } from "../../Services/apiOrders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/FoodContext";
import toast from "react-hot-toast";
import Spinner from "../../spinLoader/Spinner";
import './ordersMainPage.css'
import supabase from "../../Services/Supabase";
import useSupabaseRealtime from "../../Services/useSupabaseRealtime";
const OrdersMainPage = ({setCurrentAction}) => {
  const { isLoading, data: orders, error, refetch } = useQuery({
    queryKey: ["Orders"],
    queryFn: getOrders,
  });

  useSupabaseRealtime('Orders', 'Orders')

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { orderData, userRole } = useContext(ProductContext);

  const currentOrder = orders?.filter((order) => order.userId === orderData);

  const isApprovalPending = currentOrder?.every((order) => order.Approval === 'Accept')

  console.log('i', isApprovalPending)

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      toast.success(`Order status updated successfully`);
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });


  const { mutate: mutateUpdateDuplicateOrder, isLoading: isUpdatingDuplicateOrder } = useMutation({
    mutationFn: updateDuplicateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleUpdateStatus = (updatedStatus, id) => {
    mutate({ updatedStatus, id, idType: 'uuid' });
    mutateUpdateDuplicateOrder({updatedStatus, id, idType: 'uuid' })
  };

  const handleUpdateApproval = (updatedApproval, id) => {
    mutate({ updatedApproval, id, idType: 'uuid' });
    mutateUpdateDuplicateOrder({ updatedApproval, id, idType: 'uuid' })
  };

  const [customerLocation, setCustomerLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('latitude, longitude')
        .eq('userId', orderData)
        .single();

      if (error) {
        console.error("Error fetching location:", error);
      } else {
        setCustomerLocation(data);
      }
    };

    if (userRole === 'delivery') {
      fetchLocation();
    }
  }, [orderData, userRole]);

  const getDirections = () => {
    if (customerLocation) {
      const { latitude, longitude } = customerLocation;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank');
    } else if (order.users?.address) {
      const address = encodeURIComponent(order.users.address);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert("Customer location not available.");
    }
  };

  const handleCheckChange = (e, id) => {
    const check = e.target.checked;
    mutate({ check, id, idType: 'int8' });
    mutateUpdateDuplicateOrder({ check, id, idType: 'int8' })
    
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} ${date.toLocaleDateString()}`;
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const totalCost = (userId) => {

    const item = orders?.filter((item) => item.userId === userId)
    const totalCost = item?.reduce((acc, item) => acc + item.totalPrice, 0);
    return totalCost

  }

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {toast.error(error.message)}</p>;

  const order = currentOrder?.[0];
  if (!order) return navigate(-1);

  const phoneNumber = order?.users?.phone;

  return (
    <div className="order-details-container">
      <div className="order-header">
        <p onClick={() => {
          navigate(-1)}} className="backIcon">
          <i
            className="fa-solid fa-arrow-left-long"
            style={{ color: "fuchsia" }}
          ></i>
        </p>
        <h2>Order Details</h2>
      </div>
      <div className="order-info">
          <p>
            Order Id:
            <span style={{ textTransform: "uppercase" }}>
              {order?.users?.userShortID}
            </span>
          </p>
        <p>{formatDateTime(order?.created_at)}</p>
      </div>
      <div className="customer-info-column">
        <div className="customerInfo">
          <div className="customerAbout">
            <p className="customerIcon">
              <i className="fa-solid fa-user" style={{ color: "#109af0" }}></i>
            </p>
            <p className="customerName">
              {(userRole === "admin" || userRole === "delivery") && (
                <span>Customer</span>
              )}
              <span style={{textTransform: 'capitalize'}}>
                {order?.users?.firstName} {order?.users?.lastName}
              </span>
            </p>
          </div>
          {(userRole === "admin" || userRole === "delivery") && (
            <a className="phone" href={`tel: ${phoneNumber}`}><i className="fa-solid fa-phone" style={{ color: "red" }}></i></a>
          )}
        </div>
        <div className="paymentInfo">
          <p>Payment Info</p>
          <ul>
            <li style={{ color: "#AAA" }}>
              Method: <span style={{ color: "black" }}>Cash On Delivery</span>
            </li>
            <li style={{ color: "#AAA" }}>
              Status: <span style={{ color: "deeppink" }}>{order?.orderStatus}</span>
            </li>
            <li style={{ color: "red" }}>
              Total Cost: <span style={{ color: "red" }}>₹{totalCost(order?.userId)}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="delivery-address">
        <p>Delivery Address:</p>
        <p>
          <span>
            <i
              className="fa-solid fa-location-dot"
              style={{ color: "#e11432" }}
            ></i>{" "}
          </span>
          {order?.users?.address}
        </p>
      </div>
      <div className="order-items">
        <h3>Order Items:</h3>
        <div className="foodListContainerMobile">
          <div className="foodContainer">
            {currentOrder?.map((orderItem) => (
              <div key={orderItem?.id} className="foodCard">
                <div className="cardDetails">
                  <div id="image" className="img">
                    <img src={orderItem?.image} alt="" />
                  </div>
                  <div className="details">
                    <p id="foodName" className="foodName">
                      {orderItem?.foodName}
                    </p>
                    <p id="foodPrice" className="foodPrice">
                      ₹{orderItem?.foodPrice}
                    </p>
                    <p id="maxQuantity" className="maxQuantity">
                      <span style={{color: 'red', fontSize: '12px'}}>No. of Products: </span>
                      {orderItem?.maxQuantity}
                    </p>
                  </div>
                  <p className="time">{formatTime(orderItem?.created_at)}</p>
                </div>
                {((userRole === "delivery" && orderItem.deliveryType === 'delivery') || (userRole === "admin" && orderItem.deliveryType === 'PickUp')) &&
                  orderItem?.status === "Pending" &&
                  orderItem?.Approval !== "Pending" && (
                    <label className="checkBoxContainer">
                      <input
                        type="checkbox"
                        checked={orderItem?.check}
                        onChange={(e) => handleCheckChange(e, orderItem?.id, orderItem.userId, orderItem.deliveryType)}
                        disabled={
                          orderItem?.check ||
                          orderItem?.Approval === "Reject"
                        }
                      />
                      <div className="checkmark"></div>
                    </label>
                  )}
                {userRole === "admin" && orderItem.deliveryType === 'delivery' && (
                  <label className="checkBoxContainer">
                    <input type="checkbox" checked={orderItem?.check} disabled />
                    <div className="checkmark"></div>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="actions">
        {userRole === "admin" && isApprovalPending === false &&  (
          <>
            <button
              style={{ backgroundColor: "#D12525" }}
              disabled={isUpdating}
              onClick={() => handleUpdateApproval("Reject", order?.userId)}
            >
              Reject Order
            </button>
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateApproval("Accept", order?.userId)}
            >
              Accept Order
            </button>
          </>
        )}
        {(userRole === "admin" || userRole === 'customer') &&
          order?.Approval === "Accept" &&
          order?.status === "Pending" && order?.deliveryType === 'delivery' && (
            <button style={{ backgroundColor: "#FFB936" }}>
              Delivery Pending
            </button>
          )}
        {userRole === "customer" && order?.Approval === "Pending" && order?.deliveryType === 'delivery' && (
          <button style={{ backgroundColor: "#FFB936" }}>
            Approval Pending
          </button>
        )}
        {order?.status === "Delivered" && (
          <button style={{ backgroundColor: "#4CAF50" }}>
            Delivery Completed
          </button>
        )}
        {userRole === "delivery" && order?.status === "Pending" && order?.deliveryType === 'delivery' && (
          <>
            <button onClick={getDirections}>Get Direction</button>
            {order?.Approval === "Accept" && order?.deliveryType === 'delivery' && (
              <button
                style={{ backgroundColor: "deeppink" }}
                onClick={() => handleUpdateStatus("Delivered", order?.userId)}
              >
                Confirm Delivery
              </button>
            )}
            {order?.Approval === "Reject" && (
              <button style={{ backgroundColor: "#AAA", color: "white" }}>
                Cancelled
              </button>
            )}
            {order?.Approval === "Pending" && (
              <button style={{ backgroundColor: "#F7B107", color: "white" }}>
                Waiting For Approval
              </button>
            )}

            {order?.deliveryType === 'PickUp' && order?.orderStatus === 'Ready' && order?.Approval === 'Accept' && (<button style={{backgroundColor: '#4CAF50', color: 'white'}}>Ready</button>)}
            
            {order?.deliveryType === 'PickUp' && order?.orderStatus === 'Preparing' && order?.Approval === 'Accept' && (<button style={{backgroundColor: '#4CAF50', color: 'white'}}>Preparing</button>)}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersMainPage;
