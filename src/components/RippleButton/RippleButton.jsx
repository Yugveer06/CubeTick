import React, { useEffect, useRef, useState } from "react";
import "./RippleButton.css";
import { AnimatePresence, motion as m } from "framer-motion";

const RippleButton = React.forwardRef(
  ({ className, children, tooltip, ...props }, ref) => {
    const [ripple, setRipple] = useState(false);

    const [isHovering, setIsHovering] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const tooltipRef = useRef(null);

    const TOOLTIP_OFFSET = 16;

    const handleButtonClick = (e) => {
      const button = e.currentTarget;
      const rippleEffect = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const rippleClasses = ["bg-neutral-400/50", "dark:bg-slate-500/50"];
      rippleEffect.classList.add(...rippleClasses);

      rippleEffect.style.width = `${size}px`;
      rippleEffect.style.height = `${size}px`;
      rippleEffect.style.left = `${x}px`;
      rippleEffect.style.top = `${y}px`;

      button.appendChild(rippleEffect);

      const animationDuration = Math.log2(size + 1) * 150;
      rippleEffect.style.animationDuration = `${animationDuration}ms`;

      setRipple(true);

      setTimeout(() => {
        setRipple(false);
        button.removeChild(rippleEffect);
      }, animationDuration);
    };

    function mouseMove(e) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }

    // checks if tooltip is overflowing in any direction
    function isTooltipOverflowing() {
      const OVERFLOW_THRESHOLD = 24;
      let x = false;
      let y = false;
      if (
        window.innerWidth -
          (mousePos.x +
            TOOLTIP_OFFSET +
            (tooltipRef.current?.getBoundingClientRect().width || 0)) <
        OVERFLOW_THRESHOLD
      ) {
        x = true;
      } else {
        x = false;
      }

      if (
        window.innerHeight -
          (mousePos.y +
            TOOLTIP_OFFSET +
            (tooltipRef.current?.getBoundingClientRect().height || 0)) <
        OVERFLOW_THRESHOLD
      ) {
        y = true;
      } else {
        y = false;
      }

      return { x, y };
    }

    return (
      <>
        <m.button
          {...props}
          className={`ripple-btn ${className} ${
            ripple ? "ripple" : ""
          } active:[&>.overlay]:bg-neutral-400/50 active:[&>.overlay]:dark:bg-neutral-300/50`}
          onMouseDown={handleButtonClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={mouseMove}
        >
          <div className="overlay"></div>
          {children}
        </m.button>
        {tooltip && (
          <AnimatePresence>
            {isHovering && (
              <div
                transition={{ duration: 0.1 }}
                ref={tooltipRef}
                style={{
                  opacity: tooltipRef.current ? 1 : 0,
                  top: isTooltipOverflowing().y
                    ? mousePos.y -
                      (tooltipRef.current?.getBoundingClientRect().height ||
                        0) -
                      TOOLTIP_OFFSET
                    : mousePos.y + TOOLTIP_OFFSET,
                  left: isTooltipOverflowing().x
                    ? mousePos.x -
                      (tooltipRef.current?.getBoundingClientRect().width || 0) -
                      TOOLTIP_OFFSET
                    : mousePos.x + TOOLTIP_OFFSET,
                }}
                className="tooltip rounded bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-[1px] shadow-lg dark:from-green-200 dark:via-green-400 dark:to-blue-400"
              >
                <div className="tooltip-text rounded bg-white p-1 text-left text-black dark:bg-slate-800 dark:text-white">
                  {tooltip}
                </div>
              </div>
            )}
          </AnimatePresence>
        )}
      </>
    );
  },
);

export default RippleButton;
