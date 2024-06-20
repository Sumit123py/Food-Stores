import React, { useState } from 'react';
import './CartButton.css';

const CartButton = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1500); // Reset after animation duration
  };

  return (
    <button className={`cart-button ${clicked ? 'clicked' : ''}`} onClick={handleClick}>
      <span className="add-to-cart">Add to cart</span>
      <span className="added">Added</span>
      <i className="fas fa-shopping-cart"></i>
      <i className="fas fa-box"></i>
    </button>
  );
};

export default CartButton;
