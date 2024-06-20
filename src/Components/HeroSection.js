import React from 'react'
import SearchFilter from './SearchFilter/SearchFilter'
import FoodList from '../customerDashboard/FoodList/FoodList'

const HeroSection = ({searchData, setSearchData}) => {
  return (
    <div className='heroContainer'>

<SearchFilter searchData={searchData} setSearchData={setSearchData}/>

{/* <FoodCollection/> */}

<FoodList searchData={searchData}/>
      
    </div>
  )
}

export default HeroSection;
