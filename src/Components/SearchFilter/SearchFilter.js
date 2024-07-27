import React from 'react'
import './searchFilter.css'
const SearchFilter = ({setSearchData}) => {

    const ToggleSearchRestaurant = (e) => {
        const val = e.target.value.toLowerCase();
    
        const delay = 1000; 
    
        clearTimeout(ToggleSearchRestaurant.timer); 
    
        ToggleSearchRestaurant.timer = setTimeout(() => {
            setSearchData(val);
        }, delay);
      };
  return (
    <div className="searchContainer">
              <p className="search_icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </p>
              <input
                type="search"
                placeholder="Search"
                onInput={ToggleSearchRestaurant} // Call ToggleSearchRestaurant on input change
                id="searchId2"
              />
            </div>
  )
}

export default SearchFilter;
