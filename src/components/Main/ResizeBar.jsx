import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";

const ResizeBar = ({ setTimerWidth, setSolvesWidth }) => {
  const [resizing, setResizing] = useState(false);
  const resizeRef = useRef(null);

  useEffect(() => {
    const resizeMove = (e) => {
      if (resizing) {
        const containerRect =
          resizeRef.current.parentElement.getBoundingClientRect();
        const containerWidth = containerRect.width;

        // Calculate new widths in percentages
        const newTimerWidth =
          ((e.clientX - containerRect.left) / containerWidth) * 100;
        const newSolvesWidth = 100 - newTimerWidth;

        setTimerWidth(newTimerWidth);
        setSolvesWidth(newSolvesWidth);
      }
    };

    const resizeEnd = () => {
      setResizing(false);
    };

    if (resizing) {
      window.addEventListener("mousemove", resizeMove);
      window.addEventListener("mouseup", resizeEnd);
    }

    return () => {
      window.removeEventListener("mousemove", resizeMove);
      window.removeEventListener("mouseup", resizeEnd);
    };
  }, [resizing]);

  const resizeStart = () => {
    setResizing(true);
  };

  return (
    <>
      {resizing && (
        <m.div
          transition={{ duration: 0.2 }}
          className="fixed left-0 top-0 z-40 h-full w-full cursor-col-resize"
        ></m.div>
      )}
      <div
        ref={resizeRef}
        onMouseDown={resizeStart}
        className=" relative hidden h-full w-2 cursor-col-resize rounded md:block"
        style={{ minWidth: 8 }}
      >
        <m.div
          animate={{ height: resizing ? "100%" : 16 }}
          className="absolute left-1/2 top-1/2 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-green-400"
        ></m.div>
      </div>
    </>
  );
};

export default ResizeBar;
