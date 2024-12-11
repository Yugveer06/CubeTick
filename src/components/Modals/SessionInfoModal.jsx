import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppState } from "../../../store";
import { motion as m, AnimatePresence, useReducedMotion } from "framer-motion";
import RippleButton from "../RippleButton/RippleButton";
import SelectComp from "../Select";
import {
  getMinAverageId,
  getMinSolveTimeId,
  getAverageOfSolveTime,
} from "../../utils/getTimes";
import formatTime from "../../utils/formatTime";
import { IconArrowDown } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function SessionInfoModal({ sessionData, setSessionData, sessionSolves }) {
  const shouldReduceMotion = useReducedMotion();

  const [
    isSessionInfoModal,
    setIsSessionInfoModal,
    setSolveId,
    isSolveInfoModal,
    setIsSolveInfoModal,
    sortOrder,
    setSortOrder,
  ] = useAppState((state) => [
    state.isSessionInfoModal,
    state.setIsSessionInfoModal,
    state.setSolveId,
    state.isSolveInfoModal,
    state.setIsSolveInfoModal,
    state.sortOrder,
    state.setSortOrder,
  ]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedSolves = sessionData
    ? [...sessionSolves].sort((a, b) => {
        const timeA = a.times.start;
        const timeB = b.times.start;

        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      })
    : [];

  const chronologicalSolves = sessionData
    ? [...sessionSolves].sort((a, b) => a.times.start - b.times.start)
    : [];

  const handleSolveClick = (id) => {
    setSolveId(id);
    setIsSolveInfoModal(true);
  };

  const calculateRunningStats = (solves, index, size) => {
    if (index < size - 1) return null;
    const window = solves.slice(index - (size - 1), index + 1);
    const validTimes = window
      .filter((solve) => solve.penalty !== "dnf")
      .map((solve) => solve.solveTime);
    if (validTimes.length < Math.ceil(size * 0.6)) return null; // Require at least 60% valid times

    // Remove best and worst for ao5 and ao12
    if (size > 3) {
      validTimes.sort((a, b) => a - b);
      validTimes.pop(); // Remove worst
      validTimes.shift(); // Remove best
    }

    return validTimes.reduce((a, b) => a + b, 0) / validTimes.length / 1000; // Convert to seconds
  };

  const getBestTrend = (solves, index) => {
    const times = solves
      .slice(0, index + 1)
      .filter((solve) => solve.penalty !== "dnf")
      .map((solve) => solve.solveTime);
    return Math.min(...times) / 1000;
  };

  const chartData = {
    labels: chronologicalSolves.map((_, index) => `${index}`),
    datasets: [
      {
        label: "Solve Times",
        data: chronologicalSolves.map((solve) =>
          solve.penalty === "dnf" ? null : solve.solveTime / 1000,
        ),
        borderColor: "rgb(34, 197, 94)", // green-500
        // backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Ao5",
        data: chronologicalSolves.map((_, index) =>
          calculateRunningStats(chronologicalSolves, index, 5),
        ),
        borderColor: "rgb(59, 130, 246)", // blue-500
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5],
      },
      {
        label: "Ao12",
        data: chronologicalSolves.map((_, index) =>
          calculateRunningStats(chronologicalSolves, index, 12),
        ),
        borderColor: "rgb(168, 85, 247)", // purple-500
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5],
      },
      {
        label: "Best Solve Trend",
        data: chronologicalSolves.map((_, index) =>
          getBestTrend(chronologicalSolves, index),
        ),
        borderColor: "rgb(249, 115, 22)", // orange-500
        backgroundColor: "transparent",
        tension: 0,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          color: "rgb(148, 163, 184)", // slate-400
          font: {
            family: "Inter, system-ui, sans-serif",
          },
          usePointStyle: true,
          pointStyle: "line",
        },
      },
      title: {
        display: true,
        text: "Session Progress",
        color: "rgb(148, 163, 184)", // slate-400
        font: {
          family: "Inter, system-ui, sans-serif",
          size: 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)", // slate-400 with opacity
        },
        ticks: {
          color: "rgb(148, 163, 184)", // slate-400
          font: {
            family: "Inter, system-ui, sans-serif",
          },
          maxTicksLimit: 15, // Limit number of x-axis labels
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)", // slate-400 with opacity
        },
        ticks: {
          color: "rgb(148, 163, 184)", // slate-400
          font: {
            family: "Inter, system-ui, sans-serif",
          },
          callback: (value) => `${value}s`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  // Calculate time distribution for histogram
  const getTimeDistribution = () => {
    const validTimes = chronologicalSolves
      .filter((solve) => solve.penalty !== "dnf")
      .map((solve) => solve.solveTime / 1000);

    if (validTimes.length === 0) return { labels: [], data: [] };

    const min = Math.floor(Math.min(...validTimes));
    const max = Math.ceil(Math.max(...validTimes));
    const binSize = (max - min) / 10; // 10 bins

    const bins = Array.from({ length: 10 }, (_, i) => ({
      label: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}s`,
      count: 0,
    }));

    validTimes.forEach((time) => {
      const binIndex = Math.min(Math.floor((time - min) / binSize), 9);
      bins[binIndex].count++;
    });

    return {
      labels: bins.map((bin) => bin.label),
      data: bins.map((bin) => bin.count),
    };
  };

  // Calculate session statistics
  const getSessionStats = () => {
    const validTimes = chronologicalSolves
      .filter((solve) => solve.penalty !== "dnf")
      .map((solve) => solve.solveTime / 1000);

    if (validTimes.length === 0)
      return {
        mean: 0,
        standardDev: 0,
        best: 0,
        worst: 0,
        dnfCount: 0,
        totalSolves: 0,
        median: 0,
        bestAo5: 0,
        bestAo12: 0,
        consistency: 0,
      };

    const mean = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
    const standardDev = Math.sqrt(
      validTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
        validTimes.length,
    );

    // Calculate median
    const sortedTimes = [...validTimes].sort((a, b) => a - b);
    const median =
      sortedTimes.length % 2 === 0
        ? (sortedTimes[sortedTimes.length / 2 - 1] +
            sortedTimes[sortedTimes.length / 2]) /
          2
        : sortedTimes[Math.floor(sortedTimes.length / 2)];

    // Calculate best Ao5 and Ao12
    let bestAo5 = Infinity;
    let bestAo12 = Infinity;
    for (let i = 0; i < chronologicalSolves.length; i++) {
      const ao5 = calculateRunningStats(chronologicalSolves, i, 5);
      const ao12 = calculateRunningStats(chronologicalSolves, i, 12);
      if (ao5 && ao5 < bestAo5) bestAo5 = ao5;
      if (ao12 && ao12 < bestAo12) bestAo12 = ao12;
    }

    // Calculate consistency score (lower standard deviation relative to mean indicates better consistency)
    const consistency = 100 - (standardDev / mean) * 100;

    return {
      mean: mean.toFixed(2),
      standardDev: standardDev.toFixed(2),
      best: Math.min(...validTimes).toFixed(2),
      worst: Math.max(...validTimes).toFixed(2),
      dnfCount: chronologicalSolves.filter((solve) => solve.penalty === "dnf")
        .length,
      totalSolves: chronologicalSolves.length,
      median: median.toFixed(2),
      bestAo5: bestAo5 === Infinity ? 0 : bestAo5.toFixed(2),
      bestAo12: bestAo12 === Infinity ? 0 : bestAo12.toFixed(2),
      consistency: consistency.toFixed(1),
    };
  };

  const timeDistribution = getTimeDistribution();
  const sessionStats = getSessionStats();
  const hasValidSolves = chronologicalSolves.length > 0;
  const hasEnoughSolvesForStats = chronologicalSolves.length >= 5;

  const distributionData = {
    labels: timeDistribution.labels,
    datasets: [
      {
        label: "Solve Count",
        data: timeDistribution.data,
        backgroundColor: "rgba(34, 197, 94, 0.5)", // green-500
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
    ],
  };

  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Time Distribution",
        color: "rgb(148, 163, 184)",
        font: {
          family: "Inter, system-ui, sans-serif",
          size: 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "rgb(148, 163, 184)",
          font: {
            family: "Inter, system-ui, sans-serif",
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "rgb(148, 163, 184)",
          font: {
            family: "Inter, system-ui, sans-serif",
          },
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Dialog.Root
      open={isSessionInfoModal}
      onOpenChange={(e) => {
        setIsSessionInfoModal(e);
      }}
    >
      <AnimatePresence>
        {isSessionInfoModal && (
          <Dialog.Portal forceMount>
            <m.div
              initial={{
                opacity: shouldReduceMotion ? 1 : 0,
              }}
              animate={{ opacity: 1 }}
              exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
              className="z-50"
            >
              <Dialog.Overlay className="fixed inset-0 bg-slate-900/[0.25]" />
            </m.div>
            <m.div
              initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  opacity: {
                    duration: 0.2,
                  },
                  scale: {
                    duration: 0.3,
                    ease: [0, 0.75, 0.25, 1],
                  },
                },
              }}
              exit={{
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 0,
                transition: {
                  opacity: {
                    duration: 0.1,
                    delay: 0.1,
                  },
                  scale: {
                    duration: 0.2,
                    ease: [0.75, 0, 1, 0.25],
                  },
                },
              }}
              className="fixed z-[60]"
            >
              <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[90vh] w-[90vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 shadow-2xl dark:from-green-200 dark:via-green-400 dark:to-blue-400">
                <div className="flex h-full max-h-[calc(90vh-4px)] flex-col rounded-lg bg-white dark:bg-slate-800">
                  <div className="flex-none rounded-t-lg border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <Dialog.Title className="text-xl font-bold text-black dark:text-slate-100">
                          Session Info
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-black/70 dark:text-slate-400">
                          View your session statistics and progress.
                        </Dialog.Description>
                      </div>
                      <div>
                        <SelectComp
                          sessionData={sessionData}
                          setSessionData={setSessionData}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <main className="flex w-full flex-col [&>div]:flex [&>div]:gap-2">
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <div className="flex flex-col gap-2 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                            <h3 className="text-lg font-medium text-green-900 dark:text-slate-100">
                              Progress
                            </h3>
                            {hasValidSolves ? (
                              <div className="h-[300px] w-full">
                                <Line data={chartData} options={chartOptions} />
                              </div>
                            ) : (
                              <div className="flex h-[300px] items-center justify-center">
                                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                                  No solve data available.
                                  <br />
                                  Complete some solves to see your progress!
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                            <h3 className="text-lg font-medium text-green-900 dark:text-slate-100">
                              Distribution
                            </h3>
                            {hasValidSolves ? (
                              <div className="h-[300px] w-full">
                                <Bar
                                  data={distributionData}
                                  options={distributionOptions}
                                />
                              </div>
                            ) : (
                              <div className="flex h-[300px] items-center justify-center">
                                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                                  No solve data available.
                                  <br />
                                  Complete some solves to see your time
                                  distribution!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {hasValidSolves ? (
                          <>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Session Mean
                                </h4>
                                <p className="text-xl font-semibold text-green-900 dark:text-slate-100">
                                  {sessionStats.mean}s
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Median
                                </h4>
                                <p className="text-xl font-semibold text-green-900 dark:text-slate-100">
                                  {sessionStats.median}s
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Best Ao5
                                </h4>
                                {hasEnoughSolvesForStats ? (
                                  <p className="text-xl font-semibold text-emerald-500 dark:text-emerald-400">
                                    {sessionStats.bestAo5}s
                                  </p>
                                ) : (
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Need 5+ solves
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Best Ao12
                                </h4>
                                {chronologicalSolves.length >= 12 ? (
                                  <p className="text-xl font-semibold text-emerald-500 dark:text-emerald-400">
                                    {sessionStats.bestAo12}s
                                  </p>
                                ) : (
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Need 12+ solves
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Best Time
                                </h4>
                                <p className="text-xl font-semibold text-emerald-500 dark:text-emerald-400">
                                  {sessionStats.best}s
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Worst Time
                                </h4>
                                <p className="text-xl font-semibold text-rose-500 dark:text-rose-400">
                                  {sessionStats.worst}s
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Standard Dev
                                </h4>
                                {hasEnoughSolvesForStats ? (
                                  <p className="text-xl font-semibold text-green-900 dark:text-slate-100">
                                    {sessionStats.standardDev}s
                                  </p>
                                ) : (
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Need 5+ solves
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-4 dark:bg-slate-700/50">
                                <h4 className="text-sm font-medium text-green-700 dark:text-slate-300">
                                  Consistency
                                </h4>
                                {hasEnoughSolvesForStats ? (
                                  <p className="text-xl font-semibold text-sky-500 dark:text-sky-400">
                                    {sessionStats.consistency}%
                                  </p>
                                ) : (
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Need 5+ solves
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="overflow-x-auto">
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
                                            sortOrder === "asc"
                                              ? "rotate-180"
                                              : ""
                                          } m-1 transition-transform duration-200`}
                                          size={16}
                                        />
                                      </RippleButton>
                                    </th>
                                    <th className="p-2 text-black dark:text-white">
                                      Time
                                    </th>
                                    <th className="p-2 text-black dark:text-white">
                                      Diff
                                    </th>
                                    <th className="p-2 text-black dark:text-white">
                                      Ao5
                                    </th>
                                    <th className="p-2 text-black dark:text-white">
                                      Ao12
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sortedSolves.map((solve, index) => {
                                    const i =
                                      sortOrder === "asc"
                                        ? index
                                        : sortedSolves.length - 1 - index;

                                    return (
                                      <m.tr
                                        key={solve.id}
                                        className="text-black dark:text-white  [&>td]:border [&>td]:border-green-700 [&>td]:text-center [&>td]:dark:border-slate-700"
                                        layout="preserve-aspect"
                                      >
                                        <td className="relative h-0">
                                          <RippleButton
                                            tooltip={solve.comment}
                                            onClick={() =>
                                              handleSolveClick(solve.id)
                                            }
                                            className="h-full w-full p-2 transition-colors duration-200 hover:bg-green-300/50 hover:duration-0 hover:dark:bg-slate-800"
                                          >
                                            {i}
                                            {solve.comment !== "" && "*"}
                                          </RippleButton>
                                        </td>
                                        <td
                                          className={`gap-1 p-2 ${
                                            getMinSolveTimeId(sessionSolves) ===
                                              solve.id &&
                                            "text-yellow-600 dark:text-yellow-300"
                                          }`}
                                        >
                                          {solve.penalty === "+2"
                                            ? "+" +
                                              formatTime(solve.solveTime + 2000)
                                            : solve.penalty === "dnf"
                                              ? "DNF"
                                              : formatTime(solve.solveTime)}
                                        </td>
                                        <td
                                          className={`gap-1 p-2 ${
                                            Math.sign(
                                              solve.solveTime -
                                                sortedSolves[
                                                  sortOrder === "desc"
                                                    ? index + 1
                                                    : index - 1
                                                ]?.solveTime,
                                            ) === -1
                                              ? "text-green-500 dark:text-green-400"
                                              : "text-red-500 dark:text-red-400"
                                          }`}
                                        >
                                          {sortedSolves[
                                            sortOrder === "desc"
                                              ? index + 1
                                              : index - 1
                                          ]
                                            ? (Math.sign(
                                                solve.solveTime -
                                                  sortedSolves[
                                                    sortOrder === "desc"
                                                      ? index + 1
                                                      : index - 1
                                                  ].solveTime,
                                              ) === -1
                                                ? "-"
                                                : "+") +
                                              formatTime(
                                                Math.abs(
                                                  solve.solveTime -
                                                    sortedSolves[
                                                      sortOrder === "desc"
                                                        ? index + 1
                                                        : index - 1
                                                    ].solveTime,
                                                ),
                                              )
                                            : ""}
                                        </td>
                                        <td
                                          className={`p-2 ${
                                            getMinAverageId(
                                              sessionSolves,
                                              5,
                                            ) === solve.id &&
                                            "text-yellow-600 dark:text-yellow-300"
                                          }`}
                                        >
                                          {formatTime(
                                            getAverageOfSolveTime(
                                              sessionSolves,
                                              solve.id,
                                              5,
                                            ),
                                          )}
                                        </td>
                                        <td
                                          className={`p-2 ${
                                            getMinAverageId(
                                              sessionSolves,
                                              12,
                                            ) === solve.id &&
                                            "text-yellow-600 dark:text-yellow-300"
                                          }`}
                                        >
                                          {formatTime(
                                            getAverageOfSolveTime(
                                              sessionSolves,
                                              solve.id,
                                              12,
                                            ),
                                          )}
                                        </td>
                                      </m.tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-lg bg-green-50 p-8 text-center dark:bg-slate-700/50">
                            <p className="text-lg font-medium text-green-900 dark:text-slate-100">
                              No Solves Yet
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              Start solving to see your statistics and progress!
                            </p>
                          </div>
                        )}
                      </div>
                    </main>
                  </div>

                  <div className="flex-none rounded-b-lg border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex justify-end gap-2">
                      <Dialog.Close asChild>
                        <RippleButton className="b flex items-center gap-2 rounded border border-transparent bg-slate-100 px-2 py-1 text-black transition-[transform,[background,border]-color] duration-200 hover:border-green-400 hover:bg-green-200 active:scale-95 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:bg-blue-950">
                          <IconCheck size={16} />
                          Ok
                        </RippleButton>
                      </Dialog.Close>
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </m.div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default SessionInfoModal;
