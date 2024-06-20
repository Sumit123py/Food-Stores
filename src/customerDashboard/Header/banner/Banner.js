import React, { useEffect, useState } from "react";
import Image3 from "../../../img/chilli-shape.png";
import Image4 from "../../../img/chilli-shape-2.png";
import BannerData from "../../../BannerData";
import Image7 from "../../../img/burger-bg.png";
import Image8 from "../../../img/kfc-bg.png";
import Image9 from "../../../img/hero-bg-3.jpg";
import './banner.css'
import '../../../App.css'

const Banner = () => {
  const [value, setValue] = useState(0);

  const [bannerApi] = useState(BannerData);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => (prevValue + 1) % bannerApi.length);
    }, 7900);

    return () => clearInterval(interval);
  }, []);


  const { first, second, third, foodImage, fontSize, objectFit, rotate } =
    bannerApi[value];

  const animationStyle = {
    animation: rotate,
  };

  return (
    <div className="bannerContainer">
      <div className="banner">
        <div
          style={{ transform: `translate(-${value * 100}%)` }}
          className="slides"
        >
          <div className="img img1">
            <img src={Image7} alt="" />
          </div>
          <div className="img img2">
            <img src={Image8} alt="" />
          </div>
          <div className="img img3">
            <img src={Image9} alt="" />
          </div>
        </div>
      <div className="bannerContent">
      <div className="bannerText">
          <p style={{color: value > 0 ? '#00813D' : '#D12525'}}>CRISPY, EVERY BITE TASTE</p>
          <div className="texts">
            <h1 style={{ fontSize: fontSize }} className="first">
              {first}
            </h1>
            <h1 style={{ fontSize: fontSize }} className="second">
              {second}
            </h1>
            <h1 style={{ fontSize: fontSize }} className="third">
              {third}
            </h1>
          </div>
          <button className="order">
            <span>
              <i class="fa-solid fa-truck-fast"></i>
            </span>{" "}
            ORDER NOW
          </button>
        </div>
        <div className="bannerFoodImage" style={animationStyle}>
          <img style={{ objectFit: objectFit }} src={foodImage} alt="" />
        </div>
      </div>
        <div className="chilliImage1">
          <img src={Image3} alt="" />
        </div>
        <div className="chilliImage2">
          <img src={Image4} alt="" />
        </div>
        {/* <div className="chilliImage3">
          <img src={Image5} alt="" />
        </div> */}
        <div className="imageNavigationBtns">
          {Array.from({ length: 3 }, (_, i) => (
            <span
              style={{ backgroundColor: value === i ? "grey" : "white" }}
              key={i}
              
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
