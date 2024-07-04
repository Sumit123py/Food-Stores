import React, { useState } from 'react'
import OrdersMenu from './OrdersMenu';
import Orders from './orders/Orders';
import OrdersMobile from './OrdersMobile/OrdersMobile';

const OrderList = () => {


    


  return (
    <div className='orderListContainer'>


        {<Orders height={'95vh'}/>}

        <OrdersMobile/>
        







      
    </div>
  )
}

export default OrderList;
