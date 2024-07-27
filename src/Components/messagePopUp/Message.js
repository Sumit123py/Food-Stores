import React from 'react'
import './message.css'
const Message = ({appSetting}) => {
  const isDeliveryAvailable = appSetting?.[0].isDeliveryAvailable

  const styles = {backgroundColor: isDeliveryAvailable ? '#B6EACD' : '#FEE3E1', borderBottom: isDeliveryAvailable ? '4px solid green' : '4px solid red'}
  return (
    <div style={styles} className='messageContainer'>

        <p style={{color: isDeliveryAvailable ? 'green' : 'red'}} className="icon">
        <i className={`fa-solid fa-circle-${isDeliveryAvailable ? 'check' : 'xmark'}`}></i>
        </p>
        <p className="message">
            Sorry, Delivery boy is {isDeliveryAvailable === false ? "not" : ''} available
        </p>
      
    </div>
  )
}

export default Message;
