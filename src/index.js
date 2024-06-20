import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProductProvider } from './context/FoodContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <ProductProvider>
      <App/>
    </ProductProvider>
 
);

