import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../Components/animationData.json'; 

const LottieIcon = () => {
  const lottieRef = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    animation.addEventListener('DOMLoaded', () => {
      const elements = animation.renderer.elements;
      elements.forEach((element) => {
        if (element.path) {
          element.path.style.stroke = "#FFFFFF";  // Set the stroke color to white
          element.path.style.fill = "#FFFFFF";    // Set the fill color to white
        }
      });
    });

    return () => animation.destroy();
  }, []);

  return <div ref={lottieRef} style={{ width: 100, height: 100 }} />;
};

export default LottieIcon;
