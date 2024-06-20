import React, { useState } from 'react'
import Navbar from '../../customerDashboard/Header/Navbar/Navbar'
import Banner from '../../customerDashboard/Header/banner/Banner'
import HamburgerMenu from '../../customerDashboard/Header/HamburgerMenu/HamburgerMenu'
import ScrollToTop from '../ScrollToTop/ScrollToTop'
import HeroSection from '../HeroSection'
import { getUser } from '../../Services/apiUsers'
import { useQuery } from '@tanstack/react-query'
import Spinner from '../../spinLoader/Spinner'
import './customerDashboard.css'

const CustomerDashboard = () => {

  const [show, setShow] = useState(false)
  const [searchData, setSearchData] = useState('')
  const { isLoading, data: users, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });


  const currentUser = users?.filter(
    (user) => user.role === 'admin'
  );

  const user = currentUser?.[0];

  isLoading && <Spinner/>
  error && <p>User Cannot loaded</p>

  return (
    <div className='customerDashboardContainer'>

        <Navbar setShow={setShow} user={user} setSearchData={setSearchData}/>
        
        <Banner/>

        <HeroSection searchData={searchData} setSearchData={setSearchData}/>

        <HamburgerMenu show={show} user={user} setShow={setShow} setSearchData={setSearchData}/>

        <ScrollToTop/>
      
    </div>
  )
}

export default CustomerDashboard
