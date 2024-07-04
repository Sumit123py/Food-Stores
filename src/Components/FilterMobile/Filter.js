import React from 'react'
import OrdersMenu from '../OrdersMenu'

const Filter = () => {

  
  const [value, setValue] = useState(0)

  const Filter = [{
    value: 'All',
    title: 'All Status'
  },{
    value: 'New Order',
    title: 'New Order'
  },{
    value: 'Pending',
    title: 'Pending'
  },{
    value: 'Delivered',
    title: 'Delivered Orders'
  },{
    value: 'Rejected',
    title: 'Rejected Orders'
  }]

  return (
    <div className='FilterContainerMobile'>

      <OrdersMenu setValue={setValue} value={value} Filter={Filter}/>
      
    </div>
  )
}

export default Filter
