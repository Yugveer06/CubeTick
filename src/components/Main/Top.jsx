import { useState, useEffect, useRef } from "react";

import { IconReload, IconChevronDown } from "@tabler/icons-react";
import { motion as m, AnimatePresence, useReducedMotion } from "framer-motion";
import RippleButton from "../RippleButton/RippleButton";
import * as Select from "@radix-ui/react-select";
import { IconChevronUp } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { wcaEvents } from "cubing/puzzles";
import { TwistyPlayer } from "cubing/twisty";
import { doc } from "prettier";

function Top({
  sessionData,
  setSessionData,
  scramble,
  generateScramble,
  twistyVisualization,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [renderExpanded, setRenderExpanded] = useState(false);
  const scrambleArr = scramble.split(" ") || [];
  const twistyContainerRef = useRef(null);

  useEffect(() => {
    generateScramble();
    const player = new TwistyPlayer({
      puzzle: wcaEvents[sessionData.currentEvent].puzzleID,
      alg: scramble,
      hintFacelets: "none",
      backView: "top-right",
      background: "none",
      visualization: twistyVisualization,
      controlPanel: "none",
    });
    document.getElementById("twisty-container").appendChild(player);

    return () => {
      document.getElementById("twisty-container").removeChild(player);
    };
  }, []);

  useEffect(() => {
    const player = document.getElementById("twisty-container").firstChild;
    if (player) {
      player.setAttribute(
        "puzzle",
        wcaEvents[sessionData.currentEvent].puzzleID,
      );
      player.setAttribute("alg", scramble);
      player.setAttribute("visualization", twistyVisualization);
    }
  }, [sessionData.currentEvent, scramble, twistyVisualization]);

  return (
    <div className="w-full grow-0 rounded-xl bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 dark:from-green-200 dark:via-green-400 dark:to-blue-400">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-green-100 dark:bg-slate-900">
        <div className="main my-4 flex flex-col items-center justify-center gap-2 px-4">
          <div className="flex gap-2">
            <h1 className="text-2xl font-bold text-green-950 dark:text-slate-100">
              Scramble
            </h1>
            <Select.Root
              defaultValue="333"
              value={sessionData.currentEvent}
              onValueChange={(e) => {
                generateScramble(e);
                setSessionData((prev) => ({ ...prev, currentEvent: e }));
              }}
            >
              <Select.Trigger
                className="flex items-center gap-2 rounded bg-green-200 px-1 text-green-950 hover:bg-green-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                aria-label="Session"
              >
                <Select.Value />
                <Select.Icon>
                  <IconChevronDown size={20} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="absolute z-[61] overflow-hidden rounded bg-green-50 shadow-xl dark:bg-slate-700">
                  <Select.ScrollUpButton className="flex items-center justify-center bg-green-300 dark:bg-slate-500">
                    <IconChevronUp
                      size={20}
                      className="text-black dark:text-slate-100"
                    />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    {Object.keys(wcaEvents).map((item, i) => (
                      <Select.Item
                        className="flex cursor-default items-center gap-2 rounded px-1 text-black outline-none data-[highlighted]:bg-green-200 data-[disabled]:text-neutral-400 dark:text-slate-100 dark:data-[highlighted]:bg-slate-500/50"
                        key={i}
                        value={`${item}`}
                      >
                        <Select.ItemText>
                          {wcaEvents[item].eventName}
                        </Select.ItemText>
                        <Select.ItemIndicator>
                          <IconCheck size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex items-center justify-center bg-green-300 dark:bg-slate-500">
                    <IconChevronDown
                      size={20}
                      className="text-black dark:text-slate-100"
                    />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex flex-wrap gap-x-3 text-green-800 dark:text-slate-200">
              <AnimatePresence mode="popLayout">
                {scrambleArr.map((move, i) => {
                  let id = [];
                  let count = {};
                  for (let i = 0; i < scrambleArr.length; i++) {
                    if (count[scrambleArr[i]]) {
                      count[scrambleArr[i]]++;
                      id.push(scrambleArr[i] + "-" + count[scrambleArr[i]]);
                    } else {
                      count[scrambleArr[i]] = 1;
                      id.push(scrambleArr[i]);
                    }
                  }

                  return (
                    <m.span
                      layout={!shouldReduceMotion}
                      initial={{
                        opacity: shouldReduceMotion ? 1 : 0,
                        y: shouldReduceMotion ? 0 : 16,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: i * 0.02 },
                      }}
                      exit={{
                        opacity: shouldReduceMotion ? 1 : 0,
                        scale: shouldReduceMotion ? 1 : 0,
                        transition: { delay: i * 0.01 },
                      }}
                      key={id[i]}
                      id={id[i]}
                    >
                      {move}{" "}
                    </m.span>
                  );
                })}
              </AnimatePresence>
            </span>
            <RippleButton
              layout
              tooltip="Generate new scramble"
              onClick={() => {
                generateScramble();
              }}
              className="grid h-full w-7 min-w-7 place-items-center rounded border border-green-800 bg-green-800 p-1 text-green-300 transition-colors duration-100 hover:bg-green-300 hover:text-green-800 dark:border-slate-200 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <m.div
                key={scrambleArr?.join("_")}
                animate={{ rotate: "360deg" }}
                transition={{ duration: 0.5 }}
              >
                <IconReload size={16} />
              </m.div>
            </RippleButton>
          </div>
        </div>
        <m.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: renderExpanded ? 1 : 0,
            height: renderExpanded ? "auto" : 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: [0, 0.6, 0.4, 1],
          }}
          ref={twistyContainerRef}
          id="twisty-container"
        ></m.div>
        <RippleButton
          onClick={() => setRenderExpanded((prev) => !prev)}
          className="z-10 flex h-8 w-full items-center justify-center bg-green-200 transition-colors duration-100 hover:bg-green-300 dark:bg-slate-700/50 dark:hover:bg-slate-800 [&>.chevronDown]:hover:translate-y-0.5"
        >
          <div
            className={`chevronDown text-green-900 dark:text-slate-100 ${
              renderExpanded ? "rotate-180" : ""
            } transition-transform duration-100`}
          >
            <IconChevronDown />
          </div>
        </RippleButton>
      </div>
    </div>
  );
}

export default Top;
