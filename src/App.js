import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Registration from './Authentication/Registration';
import Login from './Authentication/Login';
import Spinner from './spinLoader/Spinner';
import Unauthorized from './Unauthorized';
import Dashboard from './Components/Dashboard/Dashboard';
import Orders from './Components/orders/Orders';
import CustomerDashboard from './Components/customerDashboard/CustomerDashboard';
import Cart from './Components/cart/Cart';
import HamburgerMenu from './customerDashboard/Header/HamburgerMenu/HamburgerMenu';
import ShoppingCartLoader from './Components/shoppinCartLoader/ShoppingCartLoader';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import FoodAddForm from './Components/FoodAddForm/FoodAddForm';
import { ProductProvider } from './context/FoodContext';
import useAuthRedirect from './Authentication/useAuthRedirect';
import OrdersMainPage from './Components/OrdersMainPage/OrdersMainPage';
import AppClosed from './Components/AppClosedPage/AppClosed';
import LottieIcon from './Components/LottieIcon';
import FCMInitializer, { messaging, requestNotificationPermission } from './features/notifications/firebase';
import { onMessage } from 'firebase/messaging';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const AppWrapper = () => {
  useAuthRedirect();
  return <AppRoutes />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Registration />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/spinner" element={<Spinner />} />
    <Route path="/appClosed" element={<AppClosed />} />
    <Route path="/Unauthorized" element={<Unauthorized />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/customerDashboard" element={<CustomerDashboard />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/hamburgerMenu" element={<HamburgerMenu />} />
    <Route path="/loader" element={<ShoppingCartLoader />} />
    <Route path="/scroll" element={<ScrollToTop />} />
    <Route path="/FoodAddForm" element={<FoodAddForm />} />
    <Route path="/orderMain" element={<OrdersMainPage />} />
  </Routes>
);

function App() {
  useEffect(() => {
    (async () => {
      // Request notification permission and register the service worker
      await requestNotificationPermission();

      // Event handler for incoming messages
      onMessage(messaging, (message) => {
        new Notification(message?.data?.title || "Notification Title", {
          icon: message?.data?.icon,
          badge: message?.data?.badge,
          body: message?.data?.body,
        });
      });

      // Request notification permission
      if (Notification.permission === 'default') {
        await Notification.requestPermission().then(permission => {
          if (permission !== 'granted') {
            console.error('Notification permission denied');
          }
        });
      }
    })();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <link rel="icon" href="https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/Logo_img/0.7100901411215532-OIPcopy.png" sizes="20x20" />
        <title>Shivaay Sweets</title>
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Router>
          <ProductProvider>
            <AppWrapper />
          </ProductProvider>
        </Router>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 1500,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: '#ffc107',
              color: '#333',
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
