import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import formatTime from "../../utils/formatTime";

const Timer = ({
  sessionData,
  sessionSolves,
  timerWidth,
  saveSolve,
  generateScramble,
  disableTimerInput,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(
    sessionSolves[sessionSolves.length - 1]?.solveTime || 0,
  );
  const times = useRef({ start: 0, end: 0 });

  const [spacePressed, setSpacePressed] = useState(false);
  const [notIsRunningSpacePressed, setNotIsRunningSpacePressed] =
    useState(false);
  const [canStart, setCanStart] = useState(false);
  const START_DELAY = 800;

  useEffect(() => {
    setTimeElapsed(sessionSolves[sessionSolves.length - 1]?.solveTime || 0);
  }, [sessionData.currentSession, sessionSolves.length]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      const startEpoch = Date.now();
      let epoch = Date.now();
      intervalId = setInterval(() => {
        epoch = Date.now();
        const milliseconds = epoch - startEpoch;

        times.current = { start: startEpoch, end: epoch };
        setTimeElapsed(milliseconds);
      }, 1);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const startStopWatch = () => {
    setIsRunning(true);
    setCanStart(false);
  };
  const pauseStopWatch = () => {
    setIsRunning(false);
    saveSolve(times.current);
  };

  // Start the timer when space is pressed for at least START_DELAY milliseconds
  useEffect(() => {
    let timeout;
    function handleKeyDown(event) {
      if (!disableTimerInput && event.code === "Space") {
        if (!spacePressed) {
          setSpacePressed(true);

          if (isRunning) {
            pauseStopWatch();
            generateScramble();
            setNotIsRunningSpacePressed(true);
          }

          timeout = setTimeout(() => {
            if (!isRunning) {
              setCanStart(true);
            } else {
              setCanStart(false);
            }
          }, START_DELAY);
        }
      }

      window.addEventListener("keyup", handleKeyUp);
    }

    function handleKeyUp(event) {
      if (!disableTimerInput && event.code === "Space") {
        clearTimeout(timeout);
        setSpacePressed(false);
        setNotIsRunningSpacePressed(false);
        if (canStart) {
          startStopWatch();
        }
      }

      window.removeEventListener("keyup", handleKeyUp);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spacePressed, isRunning, canStart, disableTimerInput]);

  return (
    <div
      className={`rounded-xl bg-gradient-to-r ${
        spacePressed && !canStart
          ? "from-red-500 to-red-900  dark:from-red-400 dark:to-red-800"
          : "from-green-500 via-green-900 to-blue-900 dark:from-green-200 dark:via-green-400 dark:to-blue-400"
      } h-full p-0.5`}
      style={{ width: timerWidth + "%", minWidth: 180 }}
    >
      <div
        className={`flex flex-col ${
          spacePressed && !canStart
            ? "bg-red-50 dark:bg-red-950"
            : "bg-green-100 dark:bg-slate-900"
        } flex-grow-1 h-full items-center justify-center overflow-hidden rounded-xl transition-colors duration-200`}
      >
        <div>
          <div className="flex items-end justify-between gap-2">
            <m.div
              layout
              className={`text-4xl font-medium ${
                spacePressed && !canStart && "text-red-500 dark:text-red-400"
              } ${canStart && "text-green-500 dark:text-green-400"} ${
                !spacePressed &&
                !canStart &&
                "text-green-900 dark:text-slate-100"
              }`}
            >
              {/* Hour */}
              {timeElapsed >= 3600000 && (
                <span>
                  {(Math.floor(timeElapsed / 1000 / 60 / 60) % 60) + ":"}
                </span>
              )}
              {/* Minute */}
              {timeElapsed >= 60000 && (
                <span>{(Math.floor(timeElapsed / 1000 / 60) % 60) + ":"}</span>
              )}
              {/* Second */}
              <span>
                {(Math.floor(timeElapsed / 1000) % 60)
                  .toString()
                  .padStart(2, "0") + "."}
              </span>
              {/* Millisecond */}
              <span>{(timeElapsed % 1000).toString().padStart(3, "0")}</span>
            </m.div>
            <AnimatePresence mode="popLayout">
              {!isRunning && sessionSolves.length >= 2 && (
                <m.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span
                    className={`${
                      Math.sign(
                        sessionSolves[sessionSolves.length - 1].solveTime -
                          sessionSolves[sessionSolves.length - 2].solveTime,
                      ) === 1
                        ? "text-red-500 dark:text-red-400"
                        : "text-green-500 dark:text-green-400"
                    }`}
                  >
                    (
                    {(Math.sign(
                      sessionSolves[sessionSolves.length - 1].solveTime -
                        sessionSolves[sessionSolves.length - 2].solveTime,
                    ) === -1
                      ? "-"
                      : "+") +
                      formatTime(
                        Math.abs(
                          sessionSolves[sessionSolves.length - 1].solveTime -
                            sessionSolves[sessionSolves.length - 2].solveTime,
                        ),
                      )}
                    )
                  </span>
                </m.div>
              )}
            </AnimatePresence>
          </div>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="relative flex h-0.5 items-center justify-center bg-black/10 dark:bg-white/10"
          >
            <AnimatePresence>
              {spacePressed && (
                <m.div
                  initial={{
                    width: notIsRunningSpacePressed ? "100%" : "0%",
                    opacity: notIsRunningSpacePressed ? 0 : 1,
                  }}
                  animate={{
                    width: "100%",
                    opacity: 1,
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  transition={{
                    width: {
                      duration: START_DELAY / 1000,
                      ease: [0.5, 0, 0.5, 1],
                    },
                    opacity: { duration: 0.1 },
                  }}
                  className={`h-full ${
                    spacePressed && !canStart
                      ? "bg-red-500 dark:bg-red-400"
                      : "bg-green-500 dark:bg-green-400"
                  }`}
                ></m.div>
              )}
            </AnimatePresence>
          </m.div>
          {/* User instructions */}
          <div className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            {isRunning ? (
              "Press SPACE to stop the timer"
            ) : canStart ? (
              <span className="text-green-600 dark:text-green-400">
                Release SPACE to start!
              </span>
            ) : spacePressed ? (
              <span className="text-red-600 dark:text-red-400">
                Hold SPACE to prepare...
              </span>
            ) : (
              <div className="space-y-1">
                <div>Press and hold SPACE to start timer</div>
                <div className="text-xs opacity-75">
                  Press CTRL+K to open command palette
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
