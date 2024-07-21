import React, { useContext } from 'react'
import { ProductContext } from '../../context/FoodContext'
import Admin from '../../Users/Admin'
import CustomerDashboard from '../customerDashboard/CustomerDashboard'
import OrderList from '../OrderList'
import Spinner from '../../spinLoader/Spinner'
import './dashboard.css'
import { getAppSetting } from '../../Services/apiAppSetting'
import AppClosed from '../AppClosedPage/AppClosed'
import { useQuery } from '@tanstack/react-query'
import useSupabaseRealtime from '../../Services/useSupabaseRealtime'
const Dashboard = () => {

    const {userRole} = useContext(ProductContext)

    const { data: appSetting } = useQuery({
      queryKey: ["appSettings"],
      queryFn: getAppSetting,
    });
    useSupabaseRealtime('appSetting', 'appSettings')
    const isAppClosed = appSetting?.[0].isAppClosed
    if (!userRole) {
        return <Spinner/>;
      }

  return (
    <>
    <div className="dashboard">
    {userRole === 'admin' && <Admin/>}
    {userRole === 'customer' && <CustomerDashboard/>}
    {userRole === 'customer' && !isAppClosed && <AppClosed/>}
    {userRole === 'delivery' && <OrderList/>}
    </div>
    </>
  )
}

export default Dashboard
