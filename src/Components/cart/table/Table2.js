import React from 'react'
import './table2.css'
const Table2 = () => {
  return (
    <div className='table2'>

        <p className='head'>cart total</p>
        <div className="col1">
          <p>subtotal</p>
          <p>₹100</p>
        </div>
        <div className="col2">
          <p>delivery</p>
          <p>₹100</p>
        </div>
        <div className="col3">
          <p>total</p>
          <p>₹100</p>
        </div>
        <button className="checkOut">checkout</button>
      
    </div>
  )
}

export default Table2
