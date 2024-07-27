import React, { useContext } from 'react'
import Image1 from '../../../img/pasta-2.png'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserId, getUser } from '../../../Services/apiUsers'
import { ProductContext } from '../../../context/FoodContext'
import './hamburgerMenu.css'
import { useQuery } from '@tanstack/react-query'
const HamburgerMenu = ({show, setShow, user, setSearchData}) => {

    const { isLoading, data: users } = useQuery({
        queryKey: ["users"],
        queryFn: getUser,
      });

      const userAdmin = users?.filter((item) => item.role === 'admin')
    const navigate = useNavigate()
    const {setOrderData, handleLogout} = useContext(ProductContext)

    const foodImages = [{
        img: Image1
    },
    {
        img: Image1
    },
    {
        img: Image1
    },
    {
        img: Image1
    },
    {
        img: Image1
    },
    {
        img: Image1
    },
]
  return (
    <div style={{background: show ? 'rgba(23, 23, 23, 0.623)' : 'transparent', visibility: show ? 'visible' : 'hidden'}}  className='hamburgerContainer'>

        <div style={{transform: `translateX(${show ? 0 : 100}%)`}} className="content">
        <div className="head">
            <div className="logoInfo">
                <div className="logoImg">
                    <img src={userAdmin?.[0].logoImage} alt="" />
                </div>
                <p className="logoName">{userAdmin?.[0].logoName}</p>
            </div>
            <p onClick={() => setShow(false)} className="closeMenu"><i className="fa-solid fa-circle-xmark" style={{color: "#ed0c0c"}}></i></p>
        </div>
        <p className="description">This involves interactions between a business and its customers. It's about meeting customers' needs and resolving their problems. Effective customer service is crucial.</p>
        <div className="foodImages">
            {foodImages.map((curImg, i) => (
                <div key={i} className="img img1">
                <img src={curImg.img} alt="" />
            </div>
            ))}
        </div>
        <div className="navigationBtns">
          <ul>
            <li>Home</li>
            <li className='shop'><p>Shop <span><i class="fa-solid fa-caret-down"></i></span></p>
            <div className="dropDownList">
            <p onClick={() => {
                setSearchData('')
                setShow(false)
        }}>All</p>
            <p onClick={() => {
                setSearchData('pizza')
                setShow(false)
        }}>PIZZA</p>
              <p onClick={() => 
              {
                setSearchData('pasta')
                setShow(false)
            }}>PASTA</p>
              <p onClick={() => {
                setSearchData('chicken')
                setShow(false)
            }}>CHICKEN</p>
              <p onClick={() => {
                setSearchData('burger')
                setShow(false)
            }}>BURGER</p>
              <p onClick={() => {
                setSearchData('noodles')
                setShow(false)
            }}>NOODLES</p>
              </div></li>
            <li>Contact</li>
            <li onClick={() => {
                setOrderData(getCurrentUserId())
                navigate('/orderMain')}}>Your Orders</li>

<li onClick={() => {
              handleLogout()
              navigate('/')
            }} className="logOut">
            <p className="logOutIcon"><i class="fa-solid fa-right-from-bracket"></i></p>
            <p>Log out</p>
            </li>
          </ul>
        </div>
        <div className="contactInfo">
            <h3>contact info</h3>
            <div className="info info1">
                <p className="icon"><i className="fa-solid fa-location-dot" style={{color: "#e11432"}}></i></p>
                <p>{user?.address}</p>
            </div>
            <div className="info info2">
            <p className="icon"><i className="fa-regular fa-envelope" style={{color: "#ec0914"}}></i></p>
                <p>{user?.personalEmail}</p>
            </div>
            <div className="info info3">
            <p className="icon"><i className="fa-regular fa-clock" style={{color: "#e60a20"}}></i></p>
                <p>mon-friday, 09am - 05pm</p>
            </div>
            <div className="info info4">
            <p className="icon"><i className="fa-solid fa-phone-flip" style={{color: "#e60a0a"}}></i></p>
                <p>{user?.phone}</p>
            </div>
        </div>
        </div>
      
    </div>
  )
}

export default HamburgerMenu;
