import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import "./App.css";
import CommandMenu from "./components/CommandMenu/CommandMenu";
import ResizeBar from "./components/Main/ResizeBar";
import Solves from "./components/Main/Solves";
import Timer from "./components/Main/Timer";
import Top from "./components/Main/Top";
import DeleteSolveModal from "./components/Modals/DeleteSolveModal";
import SessionInfoModal from "./components/Modals/SessionInfoModal";
import SolveInfoModal from "./components/Modals/SolveInfoModal";
import { ToastContextProvider, useToast } from "./context/ToastContext";
import { randomScrambleForEvent } from "cubing/scramble";

function App() {
  const { addToast } = useToast();
  const [timerWidth, setTimerWidth] = useState(70); // Initial width of Timer component
  const [solvesWidth, setSolvesWidth] = useState(30); // Initial width of Solves component
  const [scramble, setScramble] = useState("");
  const [twistyVisualization, setTwistyVisualization] = useState("2D");
  const [disableTimerInput, setDisableTimerInput] = useState(false);
  const [sessionData, setSessionData] = useLocalStorage("sessionData", {
    sessions: { Default: { solves: [] } },
    currentSession: "Default",
    currentEvent: "333",
  });
  const sessionSolves =
    sessionData.sessions[sessionData.currentSession]?.solves || [];

  async function generateScramble(event) {
    const scr = await randomScrambleForEvent(event || sessionData.currentEvent);
    setScramble(scr.toString());
  }

  const saveSolve = (times) => {
    const solve = {
      id: Math.random().toString(36).slice(2, 11),
      wcaEvent: sessionData.currentEvent,
      scramble: scramble,
      penalty: null,
      times,
      get solveTime() {
        return this.times.end - this.times.start;
      },
      comment: "",
    };
    setSessionData((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [prev.currentSession]: {
          ...prev.sessions[prev.currentSession],
          solves: [...prev.sessions[prev.currentSession].solves, solve],
        },
      },
    }));
  };

  const deleteSolve = (id) => {
    const newSolves = sessionSolves.filter((solve) => solve.id !== id);

    setSessionData((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [prev.currentSession]: {
          ...prev.sessions[prev.currentSession],
          solves: newSolves,
        },
      },
    }));

    addToast({
      title: "Solve deleted",
      description: "The solve has been deleted from the session.",
      variant: "error",
    });
  };

  const updateSolve = (id, property, value) => {
    const newSolves = sessionSolves.map((solve) => {
      if (solve.id === id) {
        return { ...solve, [property]: value };
      } else {
        return solve;
      }
    });

    setSessionData((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [prev.currentSession]: {
          ...prev.sessions[prev.currentSession],
          solves: newSolves,
        },
      },
    }));
  };

  useEffect(() => {
    generateScramble();
  }, []);

  return (
    <ToastContextProvider>
      <div className="flex h-[calc(100vh-32px)] w-full flex-col gap-2">
        <Top
          sessionData={sessionData}
          setSessionData={setSessionData}
          scramble={scramble}
          generateScramble={generateScramble}
          twistyVisualization={twistyVisualization}
        />
        <main className="relative flex h-full min-h-5 w-full flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
          <Timer
            sessionData={sessionData}
            sessionSolves={sessionSolves}
            timerWidth={timerWidth}
            saveSolve={saveSolve}
            generateScramble={generateScramble}
            disableTimerInput={disableTimerInput}
          />
          <ResizeBar
            setTimerWidth={setTimerWidth}
            setSolvesWidth={setSolvesWidth}
          />
          <Solves
            solvesWidth={solvesWidth}
            sessionData={sessionData}
            setSessionData={setSessionData}
            setDisableTimerInput={setDisableTimerInput}
          />
        </main>
        <CommandMenu
          generateScramble={generateScramble}
          sessionData={sessionData}
          setSessionData={setSessionData}
          sessionSolves={sessionSolves}
          deleteSolve={deleteSolve}
          setTwistyVisualization={setTwistyVisualization}
          setDisableTimerInput={setDisableTimerInput}
        />
        <SolveInfoModal
          sessionData={sessionData}
          sessionSolves={sessionSolves}
          deleteSolve={deleteSolve}
          updateSolve={updateSolve}
        />
        <DeleteSolveModal
          deleteSolve={deleteSolve}
          sessionSolves={sessionSolves}
        />
        <SessionInfoModal
          sessionData={sessionData}
          setSessionData={setSessionData}
          sessionSolves={sessionSolves}
        />
      </div>
    </ToastContextProvider>
  );
}

export default App;
