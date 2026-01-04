import { useEffect, useState } from "react";

export const WINDOW = {
  WIDTH: 0,
  HEIGHT: 0 
}

function getWindowDimension() {
  const { innerWidth: width, innerHeight: height} = window;
  console.log(width, height);
  return { width, height };
}

export default function Window() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
