import { useState, useEffect, useRef } from "react";

import { IconReload, IconChevronDown } from "@tabler/icons-react";
import { motion as m, AnimatePresence, useReducedMotion } from "framer-motion";
import RippleButton from "../RippleButton/RippleButton";
import { TwistyPlayer } from "cubing/twisty";

function Top({ scramble, generateScramble, twistyVisualization }) {
  const shouldReduceMotion = useReducedMotion();
  const [renderExpanded, setRenderExpanded] = useState(false);
  const scrambleArr = scramble.split(" ") || [];
  const twistyContainerRef = useRef(null);
  const twistyPlayerRef = useRef(null);

  useEffect(() => {
    generateScramble();
  }, []);

  return (
    <div className="w-full grow-0 rounded-xl bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 dark:from-green-200 dark:via-green-400 dark:to-blue-400">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-green-100 dark:bg-slate-900">
        <div className="main my-4 flex flex-col items-center justify-center gap-2 px-4">
          <h1 className="text-2xl font-bold text-green-950 dark:text-slate-100">
            Scramble
          </h1>
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
              onClick={generateScramble}
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
        >
          <twisty-player
            ref={twistyPlayerRef}
            puzzle="3x3x3"
            hint-facelets="none"
            alg={scramble}
            hintFacelets="none"
            background="none"
            visualization={twistyVisualization}
            control-panel="none"
          ></twisty-player>
        </m.div>
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
