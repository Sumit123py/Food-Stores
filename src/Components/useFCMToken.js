import { useContext } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "../features/notifications/firebase"; 
import { ProductContext } from "../context/FoodContext";

export const useFCMToken = () => {
  const { setFcmToken } = useContext(ProductContext);

  const getFCMToken = async () => {
    let token = null;

    if ("serviceWorker" in navigator) {
      try {
        // Installing Firebase service worker and try getting the token
        token = await getToken(messaging, {
          vapidKey: 'BANRUjuBsKL4HwGWWiM0dBT9kxY-9LqJQ2D85B_Yymd_rGdb0UWp_vcIG5gn9Ci58635hZ50lx9HE3HuCaJZK3s' // Replace with your VAPID key
        });

        localStorage.setItem("fcmToken", JSON.stringify(token));
        setFcmToken(token);
        console.info("Got FCM token:", token);
      } catch (error) {
        console.error("Unable to get FCM token.", error);
      }
    }

    return token;
  };

  return { getFCMToken };
};
