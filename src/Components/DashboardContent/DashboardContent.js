import React from 'react'
import FoodAddForm from '../FoodAddForm/FoodAddForm'
import FoodDashboard from '../FoodDashboard/FoodDashboard'
import OrderList from '../OrderList'
import OrdersMobile from '../OrdersMobile/OrdersMobile'
import Setting from '../Setting/Setting'
import './dashboardContent.css'
const DashboardContent = ({currentAction, setCurrentAction}) => {


  return (
    <div className='dashboardContentContainer'>

      {currentAction === 'FoodAddForm' && <FoodAddForm setCurrentAction={setCurrentAction}/>}
      {currentAction === 'dashboard' &&  <FoodDashboard setCurrentAction={setCurrentAction}/>}
      {currentAction === 'orders' && <OrderList/>}
      {currentAction === 'setting' && <Setting/>}
      {currentAction === 'orders' && <OrdersMobile setCurrentAction={setCurrentAction}/>}
      

      
    </div>
  )
}

export default DashboardContent;
