import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const OrdersMenu = ({value, setValue}) => {

  const [currentFilter, setCurrentFilter] = useSearchParams()

  const handelClick = (value, filter) => {

    currentFilter.set('status', filter)
    setCurrentFilter(currentFilter)
    setValue(value)

  }
  return (
    <div className='ordersMenuContainer'>
        <div className="menu">
            <p onClick={() => handelClick(0, 'All')} style={{backgroundColor: value === 0 ? 'orange' : 'white', color: value === 0 ? 'white' : 'black'}}>All Status</p>
            <p onClick={() => handelClick(1, 'New Order')} style={{backgroundColor: value === 1 ? 'orange' : 'white', color: value === 1 ? 'white' : 'black'}}>New Order</p>
            <p onClick={() => handelClick(2, 'Pending')} style={{backgroundColor: value === 2 ? 'orange' : 'white', color: value === 2 ? 'white' : 'black'}}>Pending</p>
            <p onClick={() => handelClick(3, 'Delivered')} style={{backgroundColor: value === 3 ? 'orange' : 'white', color: value === 3 ? 'white' : 'black'}}>Delivered</p>
            <p onClick={() => handelClick(4, 'Rejected')} style={{backgroundColor: value === 4 ? 'orange' : 'white', color: value === 4 ? 'white' : 'black'}}>Rejected Orders</p>
        </div>
    </div>
  )
}

export default OrdersMenu
