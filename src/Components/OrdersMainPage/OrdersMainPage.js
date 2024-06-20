import React, { useContext } from "react";
import { getOrders, updateOrder } from "../../Services/apiOrders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/FoodContext";
import toast from "react-hot-toast";
import Spinner from "../../spinLoader/Spinner";
import './ordersMainPage.css'
const OrdersMainPage = ({setCurrentAction}) => {
  const { isLoading, data: orders, error, refetch } = useQuery({
    queryKey: ["Orders"],
    queryFn: getOrders,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { orderData, userRole } = useContext(ProductContext);

  const currentOrder = orders?.filter((order) => order.userId === orderData);

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      toast.success(`Order status updated successfully`);
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleUpdateStatus = (updatedStatus, id) => {
    mutate({ updatedStatus, id, idType: 'uuid' });
  };

  const handleUpdateApproval = (updatedApproval, id) => {
    mutate({ updatedApproval, id, idType: 'uuid' });
  };

  const handleCheckChange = (e, id) => {
    const check = e.target.checked;
    mutate({ check, id, idType: 'int8' });
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

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {toast.error(error.message)}</p>;

  const order = currentOrder?.[0];
  if (!order) return navigate(-1);

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
        {(userRole === "admin" || userRole === "delivery") && (
          <p>
            Order Id:
            <span style={{ textTransform: "uppercase" }}>
              {order.userId?.substring(0, 8)}
            </span>
          </p>
        )}
        <p>{formatDateTime(order.created_at)}</p>
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
              <span>
                {order.users?.firstName} {order.users?.lastName}
              </span>
            </p>
          </div>
          {(userRole === "admin" || userRole === "delivery") && (
            <p className="phone">
              <i className="fa-solid fa-phone" style={{ color: "red" }}></i>
            </p>
          )}
        </div>
        <div className="paymentInfo">
          <p>Payment Info</p>
          <ul>
            <li style={{ color: "#AAA" }}>
              Method: <span style={{ color: "black" }}>Cash On Delivery</span>
            </li>
            <li style={{ color: "#AAA" }}>
              Status: <span style={{ color: "deeppink" }}>{order.status}</span>
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
          {order.users?.address}
        </p>
      </div>
      <div className="order-items">
        <h3>Order Items:</h3>
        <div className="foodListContainerMobile">
          <div className="foodContainer">
            {currentOrder?.map((foodItem) => (
              <div key={foodItem.id} className="foodCard">
                <div className="cardDetails">
                  <div id="image" className="img">
                    <img src={foodItem.image} alt="" />
                  </div>
                  <div className="details">
                    <p id="foodName" className="foodName">
                      {foodItem.foodName}
                    </p>
                    <p id="foodPrice" className="foodPrice">
                      ₹{foodItem.foodPrice}
                    </p>
                    <p id="maxQuantity" className="maxQuantity">
                      <span style={{color: 'red', fontSize: '12px'}}>No. of Products: </span>
                      {foodItem.maxQuantity}
                    </p>
                  </div>
                  <p className="time">{formatTime(foodItem.created_at)}</p>
                </div>
                {userRole === "delivery" &&
                  foodItem.status === "Pending" &&
                  foodItem.Approval !== "Pending" && (
                    <label className="checkBoxContainer">
                      <input
                        type="checkbox"
                        checked={foodItem.check}
                        onChange={(e) => handleCheckChange(e, foodItem.id)}
                        disabled={
                          foodItem.status === "Accept" ||
                          foodItem.Approval === "Reject"
                        }
                      />
                      <div className="checkmark"></div>
                    </label>
                  )}
                {userRole === "admin" && (
                  <label className="checkBoxContainer">
                    <input type="checkbox" checked={foodItem.check} disabled />
                    <div className="checkmark"></div>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="actions">
        {userRole === "admin" && order?.Approval === "Pending" && (
          <>
            <button
              style={{ backgroundColor: "#D12525" }}
              disabled={isUpdating}
              onClick={() => handleUpdateApproval("Reject", order?.userId)}
            >
              Reject Delivery
            </button>
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateApproval("Accept", order?.userId)}
            >
              Accept Delivery
            </button>
          </>
        )}
        {userRole === "admin" &&
          order?.Approval === "Accept" &&
          order?.status === "Pending" && (
            <button style={{ backgroundColor: "#FFB936" }}>
              Delivery Pending
            </button>
          )}
        {userRole === "customer" && order?.status === "Pending" && (
          <button style={{ backgroundColor: "#FFB936" }}>
            Delivery Pending
          </button>
        )}
        {order?.status === "Delivered" && (
          <button style={{ backgroundColor: "#4CAF50" }}>
            Delivery Completed
          </button>
        )}
        {userRole === "delivery" && order?.status === "Pending" && (
          <>
            <button>Get Direction</button>
            {order?.Approval === "Accept" && (
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
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersMainPage;
