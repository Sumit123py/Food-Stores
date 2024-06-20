import React, { useState } from 'react'
import AdminDashboard from '../Components/AdminDashboard/AdminDashboard';
import DashboardContent from '../Components/DashboardContent/DashboardContent';

const Admin = () => {

  const [currentAction, setCurrentAction] = useState('dashboard')
  return (
    <div className='adminContainer'>
      <AdminDashboard setCurrentAction={setCurrentAction} currentAction={currentAction}/>
      <DashboardContent setCurrentAction={setCurrentAction} currentAction={currentAction}/>
    </div>
  )
}

export default Admin;
