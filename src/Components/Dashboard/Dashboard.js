import React, { useContext } from 'react'
import { ProductContext } from '../../context/FoodContext'
import Admin from '../../Users/Admin'
import CustomerDashboard from '../customerDashboard/CustomerDashboard'
import OrderList from '../OrderList'
import Spinner from '../../spinLoader/Spinner'
import './dashboard.css'
const Dashboard = () => {

    const {userRole} = useContext(ProductContext)

    if (!userRole) {
        return <Spinner/>;
      }

  return (
    <>
    <div className="dashboard">
    {userRole === 'admin' && <Admin/>}
    {userRole === 'customer' && <CustomerDashboard/>}
    {userRole === 'delivery' && <OrderList/>}
    </div>
    </>
  )
}

export default Dashboard
