import React from 'react'
import SearchFilter from './SearchFilter/SearchFilter'
import FoodList from '../customerDashboard/FoodList/FoodList'

const HeroSection = ({searchData, setSearchData, setTitle, setMaxQuantity, setShowCartPopUp}) => {
  return (
    <div className='heroContainer'>

<SearchFilter searchData={searchData} setSearchData={setSearchData}/>

{/* <FoodCollection/> */}

<FoodList setTitle={setTitle} setMaxQuantity={setMaxQuantity} searchData={searchData} setShowCartPopUp={setShowCartPopUp}/>
      
    </div>
  )
}

export default HeroSection;
