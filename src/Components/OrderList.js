import React, { useState } from 'react'
import OrdersMenu from './OrdersMenu';
import Orders from './orders/Orders';
import OrdersMobile from './OrdersMobile/OrdersMobile';

const OrderList = () => {

    const [value, setValue] = useState(0)


  return (
    <div className='orderListContainer'>

        <OrdersMenu setValue={setValue} value={value}/>

        {<Orders height={'89vh'}/>}

        <OrdersMobile/>
        {/* {value === 1 && <NewOrders/>}
        {value === 2 && <PendingOrder/>}
        {value === 3 && <DeliveredOrder/>} */}







      
    </div>
  )
}

export default OrderList;
