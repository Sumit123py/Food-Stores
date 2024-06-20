import React, { useContext, useState } from "react";
import { deleteOrders, getOrders, updateOrder } from "../../Services/apiOrders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../spinLoader/Spinner";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { ProductContext } from "../../context/FoodContext";
import './orders.css'
const Orders = ({height}) => {
  const queryClient = useQueryClient();
  const [currentFilter] = useSearchParams();
  const { isLoading, data: orders, error } = useQuery({
    queryKey: ["Orders"],
    queryFn: getOrders,
  });
  const [value, setValue] = useState(null);
  const { mutate, isLoading: isEditing } = useMutation({
    mutationFn: ({ updatedStatus, updatedApproval, id }) => updateOrder(updatedStatus, updatedApproval, id),
    onSuccess: (data, variables) => {
      toast.success(`Order ${variables.updatedApproval || variables.updatedStatus}${(variables?.updatedApproval === 'Accept' || variables?.updatedApproval === 'Reject') ? 'ed' : ''} successfully`);
  
      queryClient.setQueryData(["Orders"], (oldData) => {
        return oldData.map((order) =>
          order.id === variables.id
            ? { ...order, status: variables.updatedStatus ?? order.status, Approval: variables.updatedApproval ?? order.Approval }
            : order
        );
      });
  
      setValue(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const { isDeleting, mutate: deleteOrder } = useMutation({
    mutationFn: deleteOrders,
    onSuccess: () => {
      toast.success('Order successfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['Orders'],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  

  const filterValue = currentFilter.get('status') || 'All';
  let orderValues;

  if (filterValue === 'Pending') {
    orderValues = orders.filter((item) => item.status === 'Pending');
  } else if (filterValue === 'Delivered') {
    orderValues = orders.filter((item) => item.status === 'Delivered');
  } else if (filterValue === 'Rejected') {
    orderValues = orders.filter((item) => item.Approval === 'Reject');
  } else {
    orderValues = orders;
  }

  const { userRole } = useContext(ProductContext);

  if (isLoading) return <Spinner />;

  const handleApprovalChange = (id, updatedApproval) => {
    mutate({ updatedStatus: undefined, updatedApproval, id });
    if(updatedApproval === 'Reject'){
      handleStatusChange(id, 'Cancelled')
    }
  };
  
  const handleStatusChange = (id, updatedStatus) => {
    mutate({ updatedStatus, updatedApproval: undefined, id });
    
  };

  
  

  return (
    <>
      <div style={{height: userRole !== 'customer' ? height : '100vh'}}  className="orderContainer">
        <div className="orderCard">
          <div className="column1">
            <p>product</p>
            <p>name</p>
            <p>price</p>
            <p>quantity</p>
            <p>subtotal</p>
            <p>status</p>
            <p>approval</p>
            {filterValue === 'Rejected' && <p>remove</p>}
          </div>
          {orderValues?.map((orderItem, index) => (
            <div key={index} className="orders">
              <div className="img">
                <img src={orderItem.image} alt="" />
              </div>
              <p className="foodName">{orderItem.foodName}</p>
              <p className="foodPrice">₹{orderItem.foodPrice}</p>
              <p className="quantity">{orderItem.maxQuantity}</p>
              <p className="subtotal">₹{orderItem.totalPrice}</p>
              <div
                onClick={() => setValue((prevValue) => (prevValue === index ? null : index))}
                className="status"
              >
                {userRole === 'delivery' && orderItem.status === 'Pending' && orderItem.Approval !== 'Pending' && orderItem.Approval !== 'Reject' && (
                  <div
                    disabled={isEditing}
                    style={{ display: value === index ? 'flex' : 'none' }}
                    className="deliveryStatusList"
                  >
                    {orderItem.status !== 'Delivered' && (
                      <p style={{ color: '#0ad443' }} onClick={() => handleStatusChange(orderItem.id, 'Delivered')}>
                        Delivered
                      </p>
                    )}
                    {orderItem.status !== 'Pending' && (
                      <p style={{ color: '#F7B107' }} onClick={() => handleStatusChange(orderItem.id, 'Pending')}>
                        Pending
                      </p>
                    )}
                  </div>
                )}
                <p
                  style={{
                    color:
                      orderItem.status === 'Pending'
                        ? '#F7B107'
                        : orderItem.status === 'Delivered'
                        ? '#0ad443'
                        : '#AAA',
                  }}
                >
                  {orderItem.status}
                </p>
                {userRole === 'delivery' && orderItem.status === 'Pending' && orderItem.Approval !== 'Pending' && orderItem.Approval !== 'Reject' && (
                  <p className="dropDownIcon">
                    <i className="fa-solid fa-caret-down"></i>
                  </p>
                )}
              </div>

              {/* second */}

              <div
                onClick={() => setValue((prevValue) => (prevValue === index ? null : index))}
                className="status"
              >
                {userRole === 'admin' && orderItem.Approval !== 'Reject' && orderItem.Approval !== 'Accept' && (
                  <div
                    disabled={isEditing}
                    style={{ display: value === index ? 'flex' : 'none' }}
                    className="statusList"
                  >
                    {orderItem.Approval !== 'Accept' && (
                      <p style={{ color: '#0ad443' }} onClick={() => handleApprovalChange(orderItem.id, 'Accept')}>
                        Accept
                      </p>
                    )}
                    {orderItem.Approval !== 'Pending' && (
                      <p style={{ color: '#F7B107' }} onClick={() => handleApprovalChange(orderItem.id, 'Pending')}>
                        Pending
                      </p>
                    )}
                    {orderItem.Approval !== 'Reject' && (
                      <p style={{ color: '#e62222' }} onClick={() => handleApprovalChange(orderItem.id, 'Reject')}>
                        Reject
                      </p>
                    )}
                  </div>
                )}
                <p
                  style={{
                    color:
                      orderItem.Approval === 'Pending'
                        ? '#F7B107'
                        : orderItem.Approval === 'Accept'
                        ? '#0ad443'
                        : '#e62222',
                  }}
                >
                  {orderItem.Approval}{orderItem.Approval === 'Accept' || orderItem.Approval === 'Reject' ? 'ed' : ''}
                </p>
                {userRole === 'admin' && orderItem.Approval !== 'Reject' && orderItem.Approval !== 'Accept' && (
                  <p className="dropDownIcon">
                    <i className="fa-solid fa-caret-down"></i>
                  </p>
                )}
              </div>
              {orderItem.Approval === 'Reject' && filterValue === 'Rejected' && (
                <button onClick={() => deleteOrder(orderItem.id)} disabled={isDeleting} className="noselect">
                  <span className="text">Delete</span>
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                    </svg>
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default Orders;
