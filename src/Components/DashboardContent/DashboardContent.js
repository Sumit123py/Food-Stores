import React, { useState } from 'react'
import FoodAddForm from '../FoodAddForm/FoodAddForm'
import FoodDashboard from '../FoodDashboard/FoodDashboard'
import OrderList from '../OrderList'
import OrdersMobile from '../OrdersMobile/OrdersMobile'
import Setting from '../Setting/Setting'
import './dashboardContent.css'
import useInsertSupabaseRealtime from '../../Services/useInsertSupabaseRealtime'
const DashboardContent = ({currentAction, setCurrentAction}) => {

  const [showForm, setShowForm] = useState(false);


  const announceNewOrder = (order, userId) => {
    
    if (userId) {
      // const user = orders?.find((currOrder) => currOrder?.users.id === userId);

      const msg = new SpeechSynthesisUtterance();
      msg.text = `नई ऑर्डर प्राप्त हुई है।`
      // ऑर्डर आईडी: ${user?.users.userShortID}, ग्राहक का नाम: ${user?.users.firstName} ${user?.users.lastName}`;
      msg.lang = "hi-IN";

      // Get the list of available voices
      const voices = window.speechSynthesis.getVoices();

      // Find a female Hindi voice
      const femaleHindiVoice = voices.find(
        (voice) => voice.lang === "hi-IN" && voice.name.includes("female")
      );

      // If a female Hindi voice is available, set it to the message
      if (femaleHindiVoice) {
        msg.voice = femaleHindiVoice;
      }

      window.speechSynthesis.speak(msg);
    }
  };

  useInsertSupabaseRealtime("Orders", "Orders", announceNewOrder)
  return (
    <div className='dashboardContentContainer'>

      {currentAction === 'FoodAddForm' && <FoodAddForm setShowForm={setShowForm} currentAction={currentAction} setCurrentAction={setCurrentAction}/>}
      {currentAction === 'dashboard' &&  <FoodDashboard showForm={showForm} setShowForm={setShowForm} setCurrentAction={setCurrentAction}/>}
      {currentAction === 'orders' && <OrderList/>}
      {currentAction === 'setting' && <Setting/>}
      {currentAction === 'orders' && <OrdersMobile setCurrentAction={setCurrentAction}/>}
      

      
    </div>
  )
}

export default DashboardContent;
