import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { deleteOrders, getOrders } from '../../Services/apiOrders';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductContext } from '../../context/FoodContext';
import toast from 'react-hot-toast';
import './ordersMobile.css'
import OrdersMenu from '../OrdersMenu';
import useSupabaseRealtime from '../../Services/useSupabaseRealtime';
const OrdersMobile = () => {
  const queryClient = useQueryClient();
  const [currentFilter] = useSearchParams();
  const { isLoading, data: orders, error } = useQuery({
    queryKey: ["Orders"],
    queryFn: getOrders,
  });

  const { setOrderData, userRole, handleLogout } = useContext(ProductContext);
  const navigate = useNavigate()
  const announceNewOrder = (order, userId) => {
    const user = orders?.users?.find(user => user.id === userId);
    
    if (user) {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `New order placed. Order ID: ${order.id}, Customer: ${user.firstName} ${user.lastName}`;
      window.speechSynthesis.speak(msg);
    }
  };
  useSupabaseRealtime('Orders', 'Orders', announceNewOrder)
  

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

  const [height, setHeight] = useState(0)
  

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} ${date.toLocaleDateString()}`;
  };

  const uniqueOrders = orders ? Array.from(new Set(orders?.map(order => order?.userId)))
    .map(userId => {
      return orders.find(order => order?.userId === userId);
    }) : [];

  const totalItem = (userId) => {

    const item = orders?.filter((item) => item.userId === userId)
    return item.length

  }

  const sortedOrders = uniqueOrders?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filterValue = currentFilter?.get('status') || 'All';
  let orderValues

  if (filterValue === 'Pending') {
    orderValues = sortedOrders?.filter((item) => item.status === 'Pending');
  } else if (filterValue === 'Delivered') {
    orderValues = sortedOrders?.filter((item) => item.status === 'Delivered');
  } else if (filterValue === 'Rejected') {
    orderValues = sortedOrders?.filter((item) => item.Approval === 'Reject');
  } else {
    orderValues = sortedOrders;
  }


  const Filter = [{
    value: 'All',
    title: 'All Status'
  },{
    value: 'New Order',
    title: 'New Order'
  },{
    value: 'Pending',
    title: 'Pending'
  },{
    value: 'Delivered',
    title: 'Delivered Orders'
  },{
    value: 'Rejected',
    title: 'Rejected Orders'
  }]


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div style={{height: userRole === 'delivery' ? '100vh' : '88vh'}} className='ordersMobileContainer'>
      
            {userRole === 'delivery' && <div onClick={() => {
              handleLogout()
              navigate('/')
            }} className="logOut">
            <p className="logOutIcon"><i class="fa-solid fa-right-from-bracket"></i></p>
            <p>LogOut</p>
            </div>}
      <div className="head">
      <h2>Order History</h2>
      <OrdersMenu height={height} setHeight={setHeight} Filter={Filter}/>
      </div>
      <div className="ordersHistoryListContainer">
        {orderValues?.map((orderItem) => {
          
          return (
            <div style={{background: orderItem.Approval === 'Reject' ? '#AAA' : ''}} className="column" key={orderItem.userId}>
              <div className="col1">
                <div className="orderId">
                  <p>OrderId:</p>
                  <p style={{textTransform: 'uppercase'}}>{orderItem.userId.substring(0, 8)}</p>
                  <p
                    style={{
                      backgroundColor:
                        orderItem.status === 'Delivered' && orderItem.Approval === 'Accept' ? '#5ee6843d' :
                        orderItem.status === 'Pending' && orderItem.Approval !== 'Reject' ? '#f7af0721' : 'rgba(128, 128, 128, 0.155)',
                      color:
                        orderItem.status === 'Delivered' && orderItem.Approval === 'Accept' ? '#0ad443' :
                        orderItem.status === 'Pending' ? '#F7B107' : 'grey'
                    }}
                    className="status"
                  >
                    {orderItem.Approval !== 'Reject' ? <span>{orderItem.status}</span> : <sp style={{color: 'grey'}}>Cancelled</sp>}
                  </p>
                </div>
                <p className="time">{formatDateTime(orderItem.created_at)}</p>
                {userRole === 'admin' && <p className="buttonDelete" onClick={() => deleteOrder(orderItem.userId)} disabled={isDeleting}>Delete</p>}
                <p className="TotalItems">Total Item: <span>{totalItem(orderItem.userId)}</span></p>
              </div>
              <div className="col2">
                <p className="locationIcon"><i className="fa-solid fa-location-dot"></i></p>
                <p className="location">{orderItem.users.address}</p>
              </div>
              {(userRole === 'admin' || orderItem.Approval !== 'Reject') && <Link 
                onClick={() => setOrderData(orderItem.userId)} 
                to={'/orderMain'} 
                className="moreDetails"
              >
                see more details <span>&gt;</span>
              </Link>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersMobile;
