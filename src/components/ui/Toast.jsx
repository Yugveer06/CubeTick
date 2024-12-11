import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconCircleCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";

const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

/**
 * @typedef {'success' | 'error' | 'warning' | 'info'} ToastVariant
 */

/**
 * Toast component for displaying notifications
 * @param {Object} props
 * @param {string} [props.className]
 * @param {ToastVariant} [props.variant]
 * @param {React.Ref<any>} ref
 */
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const dismissTimer = React.useRef(null);
  const DURATION = 5000;

  React.useEffect(() => {
    dismissTimer.current = setTimeout(() => {
      props.onOpenChange?.(false);
    }, DURATION);

    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, [props.onOpenChange]);

  const handleMouseEnter = React.useCallback(() => {
    setIsPaused(true);
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
    }
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsPaused(false);
    // Get the current progress
    const progressBar = document.querySelector(".progress-bar");
    const computedStyle = window.getComputedStyle(progressBar);
    const transform = computedStyle.transform;
    const matrix = new DOMMatrix(transform);
    const scaleX = matrix.m11;
    const remainingTime = scaleX * DURATION;

    // Set new timeout for remaining time
    dismissTimer.current = setTimeout(() => {
      props.onOpenChange?.(false);
    }, remainingTime);
  }, [props.onOpenChange]);

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <IconCircleCheck className="h-5 w-5 text-green-600" />;
      case "error":
        return <IconAlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <IconAlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <IconInfoCircle className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    switch (variant) {
      case "success":
        return "from-green-400 to-green-600";
      case "error":
        return "from-red-400 to-red-600";
      case "warning":
        return "from-yellow-400 to-yellow-600";
      case "info":
        return "from-blue-400 to-blue-600";
      default:
        return "from-purple-400 to-pink-600";
    }
  };

  return (
    <ToastPrimitives.Root ref={ref} {...props}>
      <motion.div
        layout
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
          },
        }}
        exit={{
          opacity: 0,
          x: "100%",
          transition: {
            duration: 0.4,
            ease: [0.4, 0, 1, 1],
          },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-0.5 shadow-lg",
          variant === "success" &&
            "bg-gradient-to-r from-green-400 to-green-600",
          variant === "error" && "bg-gradient-to-r from-red-400 to-red-600",
          variant === "warning" &&
            "bg-gradient-to-r from-yellow-400 to-yellow-600",
          variant === "info" && "bg-gradient-to-r from-blue-400 to-blue-600",
          !variant && "bg-gradient-to-r from-purple-400 to-pink-600",
          className,
        )}
      >
        <div
          className={cn(
            "flex w-full flex-col overflow-hidden rounded-[5px]",
            variant === "success" && "bg-green-50",
            variant === "error" && "bg-red-50",
            variant === "warning" && "bg-yellow-50",
            variant === "info" && "bg-blue-50",
            !variant && "bg-slate-50",
          )}
        >
          <div className="flex items-center space-x-4 p-4 pr-10">
            {getIcon()}
            <div className="flex-1">{props.children}</div>
            <ToastPrimitives.Close className="text-foreground/50 hover:text-foreground absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2">
              <IconX className="h-4 w-4" />
            </ToastPrimitives.Close>
          </div>
          {/* Progress bar */}
          <div className="h-1 w-full bg-gray-100">
            <div
              className={cn(
                "progress-bar h-full w-full origin-left animate-[progress_5s_linear] bg-gradient-to-r",
                getProgressColor(),
              )}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          </div>
        </div>
      </motion.div>
    </ToastPrimitives.Root>
  );
});

Toast.displayName = "Toast";

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors group-[.destructive]:border-slate-100/40 hover:bg-slate-100 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 group-[.destructive]:focus:ring-red-500 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-900 focus:opacity-100 focus:outline-none focus:ring-2",
      className,
    )}
    toast-close=""
    {...props}
  >
    <IconX className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
