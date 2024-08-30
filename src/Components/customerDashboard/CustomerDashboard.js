import React, { useState } from "react";
import Navbar from "../../customerDashboard/Header/Navbar/Navbar";
import Banner from "../../customerDashboard/Header/banner/Banner";
import HamburgerMenu from "../../customerDashboard/Header/HamburgerMenu/HamburgerMenu";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import HeroSection from "../HeroSection";
import { getCurrentUserId, getUser } from "../../Services/apiUsers";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../spinLoader/Spinner";
import "./customerDashboard.css";
import OrderReadyMessage from "../OrderReadyMessage/OrderReadyMessage";
import useSupabaseRealtime from "../../Services/useSupabaseRealtime";
import WeightSelection from "../weightSelection/WeightSelection";

const CustomerDashboard = () => {
  const [show, setShow] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [title, setTitle] = useState('')
  const [maxQuantity, setMaxQuantity] = useState(null)
  const [showCartPopUp, setShowCartPopUp] = useState(false)

  const {
    isLoading,
    data: users,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  useSupabaseRealtime("users", "users");
  const userId = getCurrentUserId();

  const user = users?.find((user) => user.role === "admin");
  const currentUserById = users?.find((user) => user.id === userId);






  const isOrderReady = currentUserById?.message;

  if (isLoading) return <Spinner />;
  if (error) return <p>User not loaded</p>;


  

  return (
    <div className="customerDashboardContainer">
      
      <Navbar setShow={setShow} user={user} setSearchData={setSearchData} />
      <Banner />
      <HeroSection  setTitle={setTitle} setMaxQuantity={setMaxQuantity}  searchData={searchData} setSearchData={setSearchData} setShowCartPopUp={setShowCartPopUp} />
      <HamburgerMenu
        show={show}
        user={user}
        setShow={setShow}
        setSearchData={setSearchData}
      />
      <WeightSelection title={title} maxQuantity={maxQuantity} showCartPopUp={showCartPopUp} setShowCartPopUp={setShowCartPopUp} />
      <ScrollToTop />
      {isOrderReady && <OrderReadyMessage userId={userId} />}

          <p class="item1"></p>
          <p class="item2"></p>
          <p class="item3"></p>
          <p class="item4"></p>
          <p class="item5"></p>
        
    </div>
  );
};

export default CustomerDashboard;
