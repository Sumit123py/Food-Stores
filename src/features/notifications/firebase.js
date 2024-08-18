

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

import { useEffect } from "react";
import { useFCMToken } from "../../Components/useFCMToken";

const config = {
    apiKey: "AIzaSyAVpVBv_XdrlBr_qLHxcf76ghlFiSPJVFk",
    authDomain: "food-store-5dfd9.firebaseapp.com",
    projectId: "food-store-5dfd9",
    storageBucket: "food-store-5dfd9.appspot.com",
    messagingSenderId: "817996691421",
    appId: "1:817996691421:web:7b6e58bf5c266b4d9ca834",
    measurementId: "G-D80S89L2MT"
  };

const app = initializeApp(config);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    try {
      // Requesting notification permission
      const permission = await Notification.requestPermission();

      if (permission) {
        console.info("Notification permission granted.");
      }
    } catch (error) {
      console.error("Unable to get permission to notify.", error);
    }
  }
};

const FCMInitializer = () => {
  const { getFCMToken } = useFCMToken();

  useEffect(() => {
    const initializeFCM = async () => {
      await Promise.all([requestNotificationPermission(), getFCMToken()]);
    };

    initializeFCM();
  }, [getFCMToken]);

  return null; 
};

export default FCMInitializer;



