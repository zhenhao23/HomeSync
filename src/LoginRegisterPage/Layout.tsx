import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(
    typeof window !== "undefined" ? window.innerWidth > 1280 : false
  );

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth > 1024);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
