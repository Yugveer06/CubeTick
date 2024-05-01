import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion as m, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAppState } from "../../../store";
import RippleButton from "../RippleButton/RippleButton";
import { IconTrash } from "@tabler/icons-react";

const DeleteSolveModal = ({ sessionSolves, deleteSolve }) => {
  const shouldReduceMotion = useReducedMotion();
  const [solveId, isDeleteSolveModal, setIsDeleteSolveModal] = useAppState(
    (state) => [
      state.solveId,
      state.isDeleteSolveModal,
      state.setIsDeleteSolveModal,
    ],
  );

  const solve = sessionSolves.filter((e) => e.id === solveId)[0];
  const index = sessionSolves.indexOf(solve);

  return (
    <Dialog.Root
      open={isDeleteSolveModal}
      onOpenChange={(e) => {
        setIsDeleteSolveModal(e);
      }}
    >
      <AnimatePresence>
        {isDeleteSolveModal && (
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
              <Dialog.Content className="max-w-[380px] rounded-lg bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 shadow-2xl dark:from-green-200 dark:via-green-400 dark:to-blue-400">
                <div className="rounded-lg bg-white p-4 dark:bg-slate-800">
                  <Dialog.Title className="text-xl font-bold text-black dark:text-slate-100">
                    Delete Solve #{index}
                  </Dialog.Title>
                  <main className="my-4 flex w-full flex-col gap-2 [&>div]:flex [&>div]:gap-2">
                    <span className="text-black dark:text-slate-100">
                      Are you absolutely sure you want to delete this solve?
                    </span>
                    <span className="rounded bg-slate-100 p-2 text-xs text-slate-400 dark:bg-slate-700">
                      Tip: You can hold shift while deleting to skip this dialog
                      box
                    </span>
                  </main>
                  <div className="flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <RippleButton className="b flex items-center gap-2 rounded border  border-transparent bg-slate-100 px-2 py-1 text-black transition-[transform,[background,border]-color] duration-200 hover:border-slate-400 hover:bg-slate-200 active:scale-95 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-400 dark:hover:bg-slate-800">
                        Cancel
                      </RippleButton>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <RippleButton
                        onClick={(e) => deleteSolve(solve.id, e.shiftKey)}
                        className="flex items-center gap-2 rounded border border-transparent bg-red-500 px-2 py-1 text-white transition-[transform,[background,border]-color] duration-200 hover:border-red-500 hover:bg-red-100 hover:text-black active:scale-95 dark:hover:bg-red-950 dark:hover:text-white"
                      >
                        <IconTrash size={16} />
                        Confirm
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

export default DeleteSolveModal;
