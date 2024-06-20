import React, { useEffect, useRef, useState } from 'react';
import './scrollToTop.css';


const ScrollToTop = () => {
  const progressPathRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const progressPath = progressPathRef.current;
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = 'stroke-dashoffset 10ms linear';

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;

      if (scroll > 50) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className={`progress-wrap ${active ? 'active-progress' : ''}`} 
      onClick={scrollToTop}
    >
      <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path ref={progressPathRef} d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>
      </svg>
    </div>
  );
};

export default ScrollToTop;
