import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../../context/FoodContext';
import './navbar.css'
import { getCart } from '../../../Services/apiCart';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUserId } from '../../../Services/apiUsers';
const Navbar = ({ setShow, setSearchData, user }) => {
  const { handleLogout } = useContext(ProductContext);
  const navigate = useNavigate();

  const {isLoading: cartLoading, data: cart } = useQuery({
    queryKey: ['carts'],
    queryFn: getCart,
  });

  const userId  = getCurrentUserId()

  const totalItem = cart.filter((item) => item.userId === userId)

  return (
  <>
    <div className='NavbarContainer'>
      <div className="navbar">
        <div className="logoContainer">
          <div className="logoImage">
            <img src={user?.logoImage} alt="Logo" />
          </div>
          <p className="logoName">{user?.logoName}</p>
        </div>
        <div className="navigationBtns">
          <ul>
            <li>Home</li>
            <li className='shop'>
              <p>Shop <span><i className="fa-solid fa-caret-down"></i></span></p>
              <div className="dropDownList">
                <p onClick={() => setSearchData('pizza')}>PIZZA</p>
                <p onClick={() => setSearchData('pasta')}>PASTA</p>
                <p onClick={() => setSearchData('chicken')}>CHICKEN</p>
                <p onClick={() => setSearchData('burger')}>BURGER</p>
                <p onClick={() => setSearchData('noodles')}>NOODLES</p>
              </div>
            </li>
            <li className='logOut' onClick={() => {
              handleLogout()
              navigate('/')
            }}>Log out</li>
            <li>Contact</li>
            <li onClick={() => navigate('/orders')}>Your Orders</li>
          </ul>
        </div>
        <div className="navigationBtns2">
          <p className="cartIcon"><i onClick={() => navigate('/cart')} className="fa-solid fa-cart-shopping" ></i><span>{totalItem?.length}</span></p>
          <p className="contactUsBtn">Contact Us</p>
          <div onClick={() => setShow(true)} className="hamBurgerIcon">
            <p className="line1"></p>
            <p className="line2"></p>
            <p className="line3"></p>
          </div>
        </div>
      </div>
    </div>



{/* // Mobile Navbar */}

<div className='NavbarContainerMobile'>
      <div className="navbar">
      <div className="navigationBtns2">
          
          
          <div onClick={() => setShow(true)} className="hamBurgerIcon">
            <p className="line1"></p>
            <p className="line2"></p>
            <p className="line3"></p>
          </div>

          <p className="cartIcon"><i onClick={() => navigate('/cart')} className="fa-solid fa-cart-shopping" ></i><span>{totalItem?.length}</span></p>
        </div>
        <div className="logoContainer">
          <div className="logoImage">
            <img src={user?.logoImage} alt="Logo" />
          </div>
          <p className="logoName">{user?.logoName}</p>
        </div>
        
        
      </div>
    </div>
  </>



  );
};

export default Navbar;
