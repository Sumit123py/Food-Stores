import React from 'react'
import './foodCollection.css'
const FoodCollection = () => {
  return (
    <div className='foodCollectionContainer'>

        <div className="foodCollectionList">
            {Array.from({length: 8}, (_, i) => 
            <>

<div className="card">
                <div className="foodImg">
                    <img src="" alt="" />
                </div>
                <div className="foodAbout">
                <h2>Food Name</h2>
                <b>NO.of Products</b>
                </div>
            </div>
            
            </>)}
        </div>
      
    </div>
  )
}

export default FoodCollection;
