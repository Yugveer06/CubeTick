import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppState } from "../../../store";
import {
    getMinAverageId,
    getMinSolveTimeId,
    getAverageOfSolveTime,
} from "../../utils/getTimes";
import formatTime from "../../utils/formatTime";
import { motion as m, AnimatePresence, useReducedMotion } from "framer-motion";
import RippleButton from "../RippleButton/RippleButton";
import { IconTrash } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { IconCrown } from "@tabler/icons-react";

const SolveInfoModal = ({
    sessionData,
    sessionSolves,
    deleteSolve,
    updateSolve,
}) => {
    const shouldReduceMotion = useReducedMotion();
    const [
        solveId,
        isSolveInfoModal,
        setIsSolveInfoModal,
        setIsDeleteSolveModal,
    ] = useAppState((state) => [
        state.solveId,
        state.isSolveInfoModal,
        state.setIsSolveInfoModal,
        state.setIsDeleteSolveModal,
    ]);

    const solve = sessionSolves.filter((e) => e.id === solveId)[0];
    const index = sessionSolves.indexOf(solve);

    const handleDeleteClick = (skipConfirm) => {
        if (skipConfirm) {
            deleteSolve(solveId);
        } else {
            setTimeout(() => {
                setIsDeleteSolveModal(true);
            }, 100);
        }
    };

    return (
        <Dialog.Root
            open={isSolveInfoModal}
            onOpenChange={(e) => {
                setIsSolveInfoModal(e);
            }}
        >
            <AnimatePresence>
                {isSolveInfoModal && (
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
                            <Dialog.Content className="rounded-lg bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 shadow-2xl dark:from-green-200 dark:via-green-400 dark:to-blue-400">
                                <div className="rounded-lg bg-white p-4 dark:bg-slate-800">
                                    <Dialog.Title className="text-xl font-bold text-black dark:text-slate-100">
                                        Solve #{index}
                                    </Dialog.Title>
                                    <main className="my-4 flex w-full flex-col [&>div]:flex [&>div]:gap-2">
                                        <table className="w-full text-black dark:text-slate-100">
                                            <tbody>
                                                <tr>
                                                    <td className="pr-4">
                                                        ID:
                                                    </td>
                                                    <td className="p-1">
                                                        {solveId}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        Time:
                                                    </td>
                                                    <td
                                                        className={`flex items-center gap-1 p-1 ${
                                                            getMinSolveTimeId(
                                                                sessionSolves,
                                                            ) === solveId &&
                                                            "text-yellow-600 dark:text-yellow-300"
                                                        }`}
                                                    >
                                                        {getMinSolveTimeId(
                                                            sessionSolves,
                                                        ) === solveId && (
                                                            <IconCrown
                                                                size={16}
                                                            />
                                                        )}
                                                        <span>
                                                            {solve.penalty ===
                                                            "+2"
                                                                ? "+" +
                                                                  formatTime(
                                                                      solve.solveTime +
                                                                          2000,
                                                                  )
                                                                : solve.penalty ===
                                                                    "dnf"
                                                                  ? `DNF(${formatTime(solve.solveTime)})`
                                                                  : formatTime(
                                                                        solve.solveTime,
                                                                    )}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {getAverageOfSolveTime(
                                                    sessionSolves,
                                                    solveId,
                                                    5,
                                                ) && (
                                                    <tr>
                                                        <td className="pr-4">
                                                            Ao5:
                                                        </td>
                                                        <td
                                                            className={`flex items-center gap-1 p-1 ${
                                                                getMinAverageId(
                                                                    sessionSolves,
                                                                    5,
                                                                ) === solveId &&
                                                                "text-yellow-600 dark:text-yellow-300"
                                                            }`}
                                                        >
                                                            {getMinAverageId(
                                                                sessionSolves,
                                                                5,
                                                            ) === solveId && (
                                                                <IconCrown
                                                                    size={16}
                                                                />
                                                            )}
                                                            <span>
                                                                {formatTime(
                                                                    getAverageOfSolveTime(
                                                                        sessionSolves,
                                                                        solveId,
                                                                        5,
                                                                    ),
                                                                )}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )}
                                                {getAverageOfSolveTime(
                                                    sessionSolves,
                                                    solveId,
                                                    12,
                                                ) && (
                                                    <tr>
                                                        <td className="pr-4">
                                                            Ao12:
                                                        </td>
                                                        <td
                                                            className={`flex items-center gap-1 p-1 ${
                                                                getMinAverageId(
                                                                    sessionSolves,
                                                                    12,
                                                                ) === solveId &&
                                                                "text-yellow-600 dark:text-yellow-300"
                                                            }`}
                                                        >
                                                            {getMinAverageId(
                                                                sessionSolves,
                                                                12,
                                                            ) === solveId && (
                                                                <IconCrown
                                                                    size={16}
                                                                />
                                                            )}
                                                            <span>
                                                                {formatTime(
                                                                    getAverageOfSolveTime(
                                                                        sessionSolves,
                                                                        solveId,
                                                                        12,
                                                                    ),
                                                                )}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td className="pr-4">
                                                        Date:
                                                    </td>
                                                    <td className="py-1">
                                                        {new Date(
                                                            solve.times.end,
                                                        ).toLocaleString([], {
                                                            hour12: true,
                                                        })}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        Scramble:
                                                    </td>
                                                    <td className="py-1">
                                                        <div className="max-w-[304px] cursor-default rounded bg-neutral-100 p-1 dark:bg-slate-700">
                                                            {solve.scramble}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        Comment:
                                                    </td>
                                                    <td className="py-1">
                                                        <input
                                                            type="text"
                                                            className="w-full max-w-[304px] rounded bg-neutral-100 p-1 placeholder-neutral-300 outline-none focus:outline-neutral-300 dark:bg-slate-700 dark:placeholder-slate-500 dark:focus:outline-slate-500"
                                                            value={
                                                                solve.comment
                                                            }
                                                            placeholder="Add a comment here..."
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                )
                                                                    setIsSolveInfoModal(
                                                                        false,
                                                                    );
                                                            }}
                                                            onChange={(e) => {
                                                                updateSolve(
                                                                    solve.id,
                                                                    "comment",
                                                                    e.target
                                                                        .value,
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        Penalty:
                                                    </td>
                                                    <td className="flex gap-1 py-1">
                                                        <div>
                                                            <RippleButton
                                                                className={`rounded-l border px-2 py-0.5 transition-colors ${
                                                                    solve.penalty ===
                                                                    null
                                                                        ? "border-green-900 bg-green-200 dark:border-blue-400 dark:bg-blue-950"
                                                                        : "border-neutral-200 hover:bg-neutral-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                                                }`}
                                                                onClick={() => {
                                                                    updateSolve(
                                                                        solve.id,
                                                                        "penalty",
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                OK
                                                            </RippleButton>
                                                            <RippleButton
                                                                className={`border px-2 py-0.5 transition-colors ${
                                                                    solve.penalty ===
                                                                    "+2"
                                                                        ? "border-green-900 bg-green-200 dark:border-blue-400 dark:bg-blue-950"
                                                                        : "border-neutral-200 hover:bg-neutral-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                                                }`}
                                                                onClick={() => {
                                                                    updateSolve(
                                                                        solve.id,
                                                                        "penalty",
                                                                        "+2",
                                                                    );
                                                                }}
                                                            >
                                                                +2
                                                            </RippleButton>
                                                            <RippleButton
                                                                className={`rounded-r border px-2 py-0.5 transition-colors ${
                                                                    solve.penalty ===
                                                                    "dnf"
                                                                        ? "border-green-900 bg-green-200 dark:border-blue-400 dark:bg-blue-950"
                                                                        : "border-neutral-200 hover:bg-neutral-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                                                }`}
                                                                onClick={() => {
                                                                    updateSolve(
                                                                        solve.id,
                                                                        "penalty",
                                                                        "dnf",
                                                                    );
                                                                }}
                                                            >
                                                                DNF
                                                            </RippleButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </main>
                                    <div className="flex justify-end gap-2">
                                        <Dialog.Close asChild>
                                            <RippleButton
                                                onClick={(e) =>
                                                    handleDeleteClick(
                                                        e.shiftKey,
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded border border-transparent bg-red-500 px-2 py-1 text-white transition-[transform,[background,border]-color] duration-200 hover:border-red-500 hover:bg-red-100 hover:text-black active:scale-95 dark:hover:bg-red-950 dark:hover:text-white"
                                            >
                                                <IconTrash size={16} />
                                                Delete Solve
                                            </RippleButton>
                                        </Dialog.Close>
                                        <Dialog.Close asChild>
                                            <RippleButton className="b flex items-center gap-2 rounded border  border-transparent bg-slate-100 px-2 py-1 text-black transition-[transform,[background,border]-color] duration-200 hover:border-green-400 hover:bg-green-200 active:scale-95 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:bg-blue-950">
                                                <IconCheck size={16} />
                                                Ok
                                            </RippleButton>
                                        </Dialog.Close>
                                    </div>
                                </div>
                            </Dialog.Content>
                        </m.div>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

export default SolveInfoModal;
