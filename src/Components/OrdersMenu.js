import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const OrdersMenu = ({Filter, height, setHeight}) => {

  const [currentFilter, setCurrentFilter] = useSearchParams()
  const [selectedTitle, setSelectedTitle] = useState('All Status')
  const [value, setValue] = useState(0)

  const handelClick = (value, filter) => {

    currentFilter.set('status', filter)
    setCurrentFilter(currentFilter)
    setValue(value)
    setSelectedTitle(filter)
    setHeight(0)

  }
  return (
    <div  className='ordersMenuContainer'>
          <p onClick={() => setHeight((prev) => prev === 0 ?'230px' : 0)} className="selectedTitle">{selectedTitle} 
          <span><i className="fa-solid fa-caret-down"></i></span></p>
        <div style={{height: height}} className="menu">
            {Filter?.map((curOpt, index) => (
              <p onClick={() => handelClick(index, curOpt.value)} style={{backgroundColor: value === index ? 'orange' : 'white', color: value === index ? 'white' : 'black'}}>{curOpt.title}</p>
            ))}
        </div>
    </div>
  )
}

export default OrdersMenu
