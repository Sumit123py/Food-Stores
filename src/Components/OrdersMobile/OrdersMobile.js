import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { deleteOrders, getOrders } from "../../Services/apiOrders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductContext } from "../../context/FoodContext";
import toast from "react-hot-toast";
import "./ordersMobile.css";
import OrdersMenu from "../OrdersMenu";
import useSupabaseRealtime from "../../Services/useSupabaseRealtime";
import Option from "../option/Option";
import Spinner from "../../spinLoader/Spinner";
const OrdersMobile = () => {
  const queryClient = useQueryClient();
  const [currentFilter] = useSearchParams();
  const {
    isLoading,
    data: orders,
    error,
  } = useQuery({
    queryKey: ["Orders"],
    queryFn: getOrders,
  });

  const { setOrderData, userRole, handleLogout } = useContext(ProductContext);
  const [index, setIndex] = useState(null);
  const navigate = useNavigate();
  // const announceNewOrder = (order, userId) => {
    
  //   if (userId) {
  //     const user = orders?.find((currOrder) => currOrder?.users.id === userId);

  //     const msg = new SpeechSynthesisUtterance();
  //     msg.text = `नई ऑर्डर प्राप्त हुई है।`
  //     // ऑर्डर आईडी: ${user?.users.userShortID}, ग्राहक का नाम: ${user?.users.firstName} ${user?.users.lastName}`;
  //     msg.lang = "hi-IN";

  //     // Get the list of available voices
  //     const voices = window.speechSynthesis.getVoices();

  //     // Find a female Hindi voice
  //     const femaleHindiVoice = voices.find(
  //       (voice) => voice.lang === "hi-IN" && voice.name.includes("female")
  //     );

  //     // If a female Hindi voice is available, set it to the message
  //     if (femaleHindiVoice) {
  //       msg.voice = femaleHindiVoice;
  //     }

  //     window.speechSynthesis.speak(msg);
  //   }
  // };

  useSupabaseRealtime("Orders", "Orders",
  //  announceNewOrder
   );

  const showOrderStatus = (userId) => {
  const currentOrder = orders?.filter((order) => order.userId === userId)
  const isOrderDelivered = currentOrder?.every((order) => order.check)
  return isOrderDelivered

  }

  const { isDeleting, mutate: deleteOrder } = useMutation({
    mutationFn: deleteOrders,
    onSuccess: () => {
      toast.success("Order successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["Orders"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  const [height, setHeight] = useState(0);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleTimeString([], {     
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} ${date.toLocaleDateString()}`;
  };

  const uniqueOrders = orders
    ? Array.from(new Set(orders?.map((order) => order?.userId))).map(
        (userId) => {
          return orders.find((order) => order?.userId === userId);
        }
      )                                   
    : [];

  const totalItem = (userId) => {
    const item = orders?.filter((item) => item.userId === userId);
    return item.length;
  };

  const totalCost = (userId) => {
    const item = orders?.filter((item) => item.userId === userId);
    const totalCost = item?.reduce((acc, item) => acc + item.totalPrice, 0);
    return totalCost;
  };

  const handleOrderReady = (id, i) => {
    setOrderData(id);
    setIndex((prev) => prev === i ? null : i)

  };

  const sortedOrders = uniqueOrders?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const filterValue = currentFilter?.get("status") || "All";
  let orderValues;

  if (filterValue === "Pending") {
    orderValues = sortedOrders?.filter((item) => item.status === "Pending");
  } else if (filterValue === "Delivered") {
    orderValues = sortedOrders?.filter((item) => item.status === "Delivered");
  } else if (filterValue === "Rejected") {
    orderValues = sortedOrders?.filter((item) => item.Approval === "Reject");
  } else {
    orderValues = sortedOrders;
  }

  const filterOrderValues = orderValues
  ?.filter((values) => values.orderStatus) // Filter by orderStatus
  ?.sort((a, b) => {
    if (a.orderStatus === "Pending" && b.orderStatus !== "Pending") {
      return -1; // Place "Pending" orders at the top
    }
    if (a.orderStatus !== "Pending" && b.orderStatus === "Pending") {
      return 1; // Keep "Pending" orders at the top
    }
    if (a.orderStatus === "Delivered" && b.orderStatus !== "Delivered") {
      return 1; // Place "Delivered" orders at the bottom
    }
    if (a.orderStatus !== "Delivered" && b.orderStatus === "Delivered") {
      return -1; // Keep "Delivered" orders at the bottom
    }
    return 0; // Keep the same order for other statuses
  });

  const Filter = [
    {
      value: "All",
      title: "All Status",
    },
    {
      value: "New Order",
      title: "New Order",
    },
    {
      value: "Pending",
      title: "Pending",
    },
    {
      value: "Delivered",
      title: "Delivered Orders",
    },
    {
      value: "Rejected",
      title: "Rejected Orders",
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div
      style={{ height: userRole === "delivery" ? "100vh" : "88vh" }}
      className="ordersMobileContainer"
    >
      {userRole === "delivery" && (
        <div
          onClick={() => {
            handleLogout();
            navigate("/");
          }}
          className="logOut"
        >
          <p className="logOutIcon">
            <i class="fa-solid fa-right-from-bracket"></i>
          </p>
          <p>LogOut</p>
        </div>
      )}
      <div className="head">
        <h2>Order History</h2>
        <OrdersMenu height={height} setHeight={setHeight} Filter={Filter} />
      </div>
      <div className="ordersHistoryListContainer">
        {filterOrderValues?.map((orderItem, i) => {
          return (
            <div
              style={{
                backgroundColor:
                        orderItem.Approval === 'Reject'
                          ? "rgba(128, 128, 128, 0.155)" 
                          : showOrderStatus(orderItem.userId) === false
                          ? "#f7af0721"
                          : "#5ee6843d",
              }}
              className="column"
              key={orderItem.userId}
            >
              <div className="col1">
                <div className="orderId">
                  <p>OrderId:</p>
                  <p style={{ textTransform: "uppercase" }}>
                    {orderItem.users.userShortID}
                  </p>
                  {orderItem.deliveryType === 'PickUp' && <p
                    style={{
                      backgroundColor:
                        orderItem.Approval === 'Reject'
                          ? "rgba(128, 128, 128, 0.155)" 
                          : showOrderStatus(orderItem.userId) === false
                          ? "#f7af0721"
                          : "#5ee6843d",
                      color:
                        orderItem.Approval === 'Reject'
                          ? "grey" 
                          : showOrderStatus(orderItem.userId) === false
                          ? "#F7B107"
                          : "#0ad443",
                    }}
                    className="status"
                  >
                    {orderItem.Approval !== "Reject" ? (
                      <span>{showOrderStatus(orderItem.userId) ? 'Cooked' : 'Cooking'}</span>
                    ) : (
                      <span style={{ color: "grey" }}>Cancelled</span>
                    )}
                  </p>}
                </div>
                <p className="time">{formatDateTime(orderItem.created_at)}</p>
                {userRole === "admin" && (
                  <p
                    className="buttonDelete"
                    onClick={() => deleteOrder(orderItem.userId)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Spinner/> : 'Delete'}
                  </p>
                )}
                <p className="totalItems">
                  Total Item: <span>{totalItem(orderItem.userId)}</span>
                </p>
                <p className="totalCost" style={{ color: "red" }}>
                  Total Cost: <span>₹{totalCost(orderItem.userId) + (orderItem.deliveryType === 'delivery' ? 2 : 0)}</span>
                </p>
              </div>
              <div className="col2">
                <p className="locationIcon">
                  <i className="fa-solid fa-location-dot"></i>
                </p>
                <p className="location">{orderItem.users.address}</p>
              </div>
              <div  className="col3">
                <p style={{gap: '20px'}} onClick={() => handleOrderReady(orderItem.userId, i)} className="status">
                  {orderItem.orderStatus}
                  <span>
                    <i className="fa-solid fa-caret-up"></i>
                  </span>
                </p>
                <Option
                  i={i}
                  index={index}
                  setIndex={setIndex}
                  userId={orderItem.userId}
                />
              </div>
              {(userRole === "admin" || orderItem.Approval !== "Reject") && (
                <Link
                  onClick={() => setOrderData(orderItem.userId)}
                  to={"/orderMain"}
                  className="moreDetails"
                >
                  see more details <span>&gt;</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersMobile;
