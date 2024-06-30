import React from "react";
import { IconArrowDown, IconInfoCircle } from "@tabler/icons-react";
import RippleButton from "../RippleButton/RippleButton";
import formatTime from "../../utils/formatTime";
import {
  getMinAverageId,
  getMinSolveTimeId,
  getAverageOfSolveTime,
} from "../../utils/getTimes";
import { useAppState } from "../../../store";
import { motion as m } from "framer-motion";
import SelectComp from "../Select";

const Solves = ({ solvesWidth, sessionData, setSessionData }) => {
  const sessionSolves =
    sessionData.sessions[sessionData.currentSession]?.solves || [];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const [
    sortOrder,
    setSortOrder,
    setSolveId,
    sessionName,
    setSessionName,
    setIsSolveInfoModal,
    setIsSessionInfoModal,
  ] = useAppState((state) => [
    state.sortOrder,
    state.setSortOrder,
    state.setSolveId,
    state.sessionName,
    state.setSessionName,
    state.setIsSolveInfoModal,
    state.setIsSessionInfoModal,
  ]);

  // sort based on start time of a solve
  const sortedSolves = sessionData
    ? [...sessionSolves].sort((a, b) => {
        const timeA = a.times.start;
        const timeB = b.times.start;

        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      })
    : [];

  const handleSessionInfoClick = (id) => {
    setSessionName(sessionData.currentSession);
    setIsSessionInfoModal(true);
  };

  const handleSolveClick = (id) => {
    setSolveId(id);
    setIsSolveInfoModal(true);
  };

  return (
    <div
      className="h-full rounded-xl bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 dark:from-green-200 dark:via-green-400 dark:to-blue-400"
      style={{ width: solvesWidth + "%", minWidth: 280 }}
    >
      <div className="relative flex h-full flex-col items-center overflow-hidden rounded-xl bg-green-100 dark:bg-slate-900">
        <header className="sticky top-0 z-10 flex w-full flex-col items-center justify-center bg-green-200 p-2 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-green-900 dark:text-slate-100">
            Solves
          </h1>
          <div className="flex gap-1.5">
            <span className="text-green-900 dark:text-slate-200">Session</span>
            <SelectComp
              sessionData={sessionData}
              setSessionData={setSessionData}
            />
            <RippleButton
              onClick={handleSessionInfoClick}
              className="rounded-full text-green-900 dark:text-slate-100"
            >
              <IconInfoCircle size={24} />
            </RippleButton>
          </div>
        </header>
        <main className="w-full overflow-y-auto overflow-x-clip p-2 scrollbar-thin scrollbar-thumb-green-900/50 scrollbar-thumb-rounded hover:scrollbar-thumb-green-900 dark:scrollbar-thumb-slate-500 dark:hover:scrollbar-thumb-slate-600">
          <table className="w-full">
            <thead>
              <tr className="[&>td]:text-center [&>th]:border [&>th]:border-green-700 [&>th]:dark:border-slate-700 ">
                <th>
                  <RippleButton
                    onClick={toggleSortOrder}
                    className="flex w-full justify-center p-2 text-black transition-colors duration-200 hover:bg-green-300/50 hover:duration-0 dark:text-white hover:dark:bg-slate-800"
                  >
                    <IconArrowDown
                      className={`z-0 ${
                        sortOrder === "asc" ? "rotate-180" : ""
                      } m-1 transition-transform duration-200`}
                      size={16}
                    />
                  </RippleButton>
                </th>
                <th className="p-2 text-black dark:text-white">Time</th>
                <th className="p-2 text-black dark:text-white">Ao5</th>
                <th className="p-2 text-black dark:text-white">Ao12</th>
              </tr>
            </thead>
            <tbody>
              {sortedSolves.map((solve, index) => {
                const i =
                  sortOrder === "asc" ? index : sortedSolves.length - 1 - index;
                return (
                  <m.tr
                    key={solve.id}
                    className="text-black dark:text-white  [&>td]:border [&>td]:border-green-700 [&>td]:text-center [&>td]:dark:border-slate-700"
                    layout="preserve-aspect"
                  >
                    <td className="relative h-0">
                      <RippleButton
                        tooltip={solve.comment}
                        onClick={() => handleSolveClick(solve.id)}
                        className="h-full w-full p-2 transition-colors duration-200 hover:bg-green-300/50 hover:duration-0 hover:dark:bg-slate-800"
                      >
                        {i}
                        {solve.comment !== "" && "*"}
                      </RippleButton>
                    </td>
                    <td
                      className={`gap-1 p-2 ${
                        getMinSolveTimeId(sessionSolves) === solve.id &&
                        "text-yellow-600 dark:text-yellow-300"
                      }`}
                    >
                      {solve.penalty === "+2"
                        ? "+" + formatTime(solve.solveTime + 2000)
                        : solve.penalty === "dnf"
                          ? "DNF"
                          : formatTime(solve.solveTime)}
                    </td>
                    <td
                      className={`p-2 ${
                        getMinAverageId(sessionSolves, 5) === solve.id &&
                        "text-yellow-600 dark:text-yellow-300"
                      }`}
                    >
                      {formatTime(
                        getAverageOfSolveTime(sessionSolves, solve.id, 5),
                      )}
                    </td>
                    <td
                      className={`p-2 ${
                        getMinAverageId(sessionSolves, 12) === solve.id &&
                        "text-yellow-600 dark:text-yellow-300"
                      }`}
                    >
                      {formatTime(
                        getAverageOfSolveTime(sessionSolves, solve.id, 12),
                      )}
                    </td>
                  </m.tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default Solves;
