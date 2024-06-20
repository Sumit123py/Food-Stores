import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate()

  return (
    <>
      <div className="unauthorizedContainer">
      <div className="lock"></div>
      <div className="message">
        <h1>Access to this page is restricted</h1>
        
      </div>
      <button className="backBtn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </>
  );
};

export default Unauthorized;
