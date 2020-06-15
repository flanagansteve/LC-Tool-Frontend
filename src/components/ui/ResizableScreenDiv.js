import React, {useEffect, useRef, useState} from "react";

export const ResizableScreenDiv = ({style, children, minTop}) => {
  const containerRef = useRef(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    setTop(containerRef.current.getBoundingClientRect().top);
    const scrollHandler = () => setTop(containerRef.current.getBoundingClientRect().top);
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
      <div ref={containerRef} style={{...style, height: `calc(100vh - ${Math.max(top, minTop === undefined ? 40 : minTop)}px)`}}>
        {children}
      </div>
  )
};
