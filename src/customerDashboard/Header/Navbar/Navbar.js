import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../../context/FoodContext';
import './navbar.css'
const Navbar = ({ setShow, setSearchData, user }) => {
  const { totalItem, handleLogout } = useContext(ProductContext);
  const navigate = useNavigate();

  return (
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
          <p className="cartIcon"><i onClick={() => navigate('/cart')} className="fa-solid fa-cart-shopping" ></i><span>{totalItem}</span></p>
          <p className="contactUsBtn">Contact Us</p>
          <div onClick={() => setShow(true)} className="hamBurgerIcon">
            <p className="line1"></p>
            <p className="line2"></p>
            <p className="line3"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
