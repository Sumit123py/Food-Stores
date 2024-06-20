import React, { useContext, useState } from 'react'
import image1 from '../../img/computer.png'
import image2 from '../../img/delivery.png'
import image3 from '../../img/order-delivery.png'
import { useNavigate } from 'react-router-dom'
import { ProductContext } from '../../context/FoodContext'
import './adminDashboard.css'
const AdminDashboard = ({setCurrentAction, currentAction}) => {

  const [height, setHeight] = useState(0)
  const {handleLogout} = useContext(ProductContext)
  const navigate = useNavigate()

  return (
    <>
    <div className='adminDashboardNavigation'>
      <div style={{backgroundColor: currentAction === 'dashboard' ? 'orange' : '#F5F5F5', color: currentAction === 'dashboard' ? 'white' : 'black' }} onClick={() => setCurrentAction('dashboard')} className="nav dashboard">
        <img src={image1} alt="" className="img dashboardImg" />
        <p className='title'>dashboard</p>
      </div>
      <div style={{backgroundColor: currentAction === 'FoodAddForm' ? 'orange' : '#F5F5F5', color: currentAction === 'FoodAddForm' ? 'white' : 'black' }}  onClick={() => setCurrentAction('FoodAddForm')} className="nav addFood">
        <img src={image2} alt="" className="img addFoodImg" />
        <p className='title'>Add Food</p>
      </div>
      <div style={{backgroundColor: currentAction === 'orders' ? 'orange' : '#F5F5F5', color: currentAction === 'orders' ? 'white' : 'black' }}  onClick={() => setCurrentAction('orders')} className="nav orders">
        <img src={image3} alt="" className="img addFoodImg" />
        <p className='title'>Orders</p>
      </div>
      <div style={{backgroundColor: currentAction === 'setting' ? 'orange' : '#F5F5F5', color: currentAction === 'setting' ? 'white' : 'black' }}  onClick={() => setCurrentAction('setting')} className="nav setting">
        <p className="img settingIcon"><i class="fa-solid fa-gear"></i></p>
        <p className='title'>Settings</p>
      </div>
    </div>

    {/* second */}


    <div className="dashboardNavigation">
      <label  class="hamburger">
  <input onClick={() => {
    setHeight((prev) => prev === 0 ? '25vh' : 0)
    }} type="checkbox" />
  <svg viewBox="0 0 32 32">
    <path class="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
    <path class="line" d="M7 16 27 16"></path>
  </svg>
</label>
    <div style={{height: height, padding: height === 0 ? '0px' : '10px'}} className='adminDashboardNavigationMobile'>
      <div style={{backgroundColor: currentAction === 'dashboard' ? 'orange' : '#F5F5F5', color: currentAction === 'dashboard' ? 'white' : 'black' }} onClick={() => {
        setCurrentAction('dashboard')
        setHeight(0)
        }} className="nav dashboard">
        <img src={image1} alt="" className="img dashboardImg" />
        <p className='title'>dashboard</p>
      </div>
      <div style={{backgroundColor: currentAction === 'FoodAddForm' ? 'orange' : '#F5F5F5', color: currentAction === 'FoodAddForm' ? 'white' : 'black' }}  onClick={() => {
        setCurrentAction('FoodAddForm')
        setHeight(0)
        }} className="nav addFood">
        <img src={image2} alt="" className="img addFoodImg" />
        <p className='title'>Add Food</p>
      </div>
      <div style={{backgroundColor: currentAction === 'orders' ? 'orange' : '#F5F5F5', color: currentAction === 'orders' ? 'white' : 'black' }}  onClick={() => {
        setCurrentAction('orders')
        setHeight(0)
        }} className="nav orders">
        <img src={image3} alt="" className="img addFoodImg" />
        <p className='title'>Orders</p>
      </div>
      <div style={{backgroundColor: currentAction === 'setting' ? 'orange' : '#F5F5F5', color: currentAction === 'setting' ? 'white' : 'black' }}  onClick={() => {
        setCurrentAction('setting')
        setHeight(0)

        }} className="nav setting">
        <p className="img settingIcon"><i class="fa-solid fa-gear"></i></p>
        <p className='title'>Settings</p>
      </div>
      <div  onClick={() => {
        setHeight(0)
        handleLogout()
        navigate('/')
        }} className="nav logout">
        <p className="img logOutIcon"><i class="fa-solid fa-right-from-bracket"></i></p>
        <p className='title'>Log out</p>
      </div>
    </div>
    </div>
    
    </>
    
  )
}

export default AdminDashboard;
