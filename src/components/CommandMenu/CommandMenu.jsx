import { Command } from "cmdk";
import React, { useEffect, useState } from "react";
import { puzzles } from "cubing/puzzles";
import {
  IconCube,
  IconDeviceDesktop,
  IconForms,
  IconHome,
  IconPerspective,
  IconPlus,
  IconReload,
  IconSquare,
  IconTrash,
} from "@tabler/icons-react";
import RippleButton from "../RippleButton/RippleButton";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion as m, useReducedMotion } from "framer-motion";
import formatTime from "../../utils/formatTime";
import { useAppState } from "../../../store";

const CommandMenu = ({
  generateScramble,
  sessionData,
  setSessionData,
  sessionSolves,
  deleteSolve,
  setTwistyVisualization,
  setDisableTimerInput,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [value, onValueChange] = useState("");
  const [search, setSearch] = useState("");
  const [pages, setPages] = useState([]);
  const page = pages[pages.length - 1];
  const [setSolveId, setIsDeleteSolveModal] = useAppState((state) => [
    state.setSolveId,
    state.setIsDeleteSolveModal,
  ]);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const lightTheme = () => {
    document.documentElement.classList.remove("dark");
    setOpen(false);
    setPages([]);
  };

  const darkTheme = () => {
    document.documentElement.classList.add("dark");
    setOpen(false);
    setPages([]);
  };

  const createNewSession = () => {
    setSessionData((prev) => ({
      ...prev,
      sessions: { ...prev.sessions, [search]: { solves: [] } },
    }));
    setPages([]);
    setOpen(false);
  };

  const selectSession = () => {
    setSessionData((prev) => ({
      ...prev,
      currentSession: search,
    }));
    setPages([]);
    setOpen(false);
  };

  const renameSession = (oldName, newName) => {
    setSessionData((prev) => {
      const updatedSessionData = {
        ...prev,
        sessions: {
          ...prev.sessions,
          [newName]: prev.sessions[oldName],
        },
      };
      delete updatedSessionData.sessions[oldName];
      if (prev.currentSession === oldName) {
        updatedSessionData.currentSession = newName;
      }

      return updatedSessionData;
    });
    setPages([]);
    setSearch("");
    setOpen(false);
  };

  const deleteSession = (keyToDelete) => {
    if (sessionData.currentSession === keyToDelete) {
      setSessionData((prev) => {
        const { [keyToDelete]: deletedKey, ...rest } = prev.sessions;
        const updatedSessionData = {
          currentSession: "Default",
          sessions: { ...rest },
        };
        return updatedSessionData;
      });
    } else {
      setSessionData((prev) => {
        const { [keyToDelete]: deletedKey, ...rest } = prev.sessions;
        const updatedSessionData = {
          ...prev,
          sessions: { ...rest },
        };
        return updatedSessionData;
      });
    }
  };

  const getInputPlaceholder = () => {
    const pageString = pages.join(", ");

    switch (pageString) {
      case "delete solve":
        return "Delete Solve";
      case "theme":
        return "Choose your theme";
      case "scramble visualization":
        return "Choose your preferred visualization";
      case "create session":
        return "Enter session name";
      case "rename session":
        return "Choose the session to rename";
      case "rename session, new name":
        return "Enter new session name";
      default:
        return "What do you need?";
    }
  };

  useEffect(() => {
    setSearch("");
    setDisableTimerInput(open);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
              }}
              className="z-[500]"
            >
              <Dialog.Overlay className="fixed inset-0 bg-slate-900/[0.25]" />
            </m.div>
            <m.div
              // key={pages.length}
              initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 1.2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  opacity: {
                    duration: 0.1,
                  },
                  scale: {
                    duration: 0.2,
                    ease: [0, 0.75, 0.25, 1],
                  },
                },
              }}
              exit={{
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 0.8,
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
              className="fixed top-0 z-[501] w-full min-w-64 max-w-lg sm:top-1/4 sm:w-8/12"
            >
              <Dialog.Content className="rounded-lg bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 shadow-2xl dark:from-green-200 dark:via-green-400 dark:to-blue-400">
                <Command
                  value={value}
                  onValueChange={onValueChange}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Escape" ||
                      (e.key === "Backspace" && !search)
                    ) {
                      e.preventDefault();
                      setSearch("");
                      setPages((pages) => pages.slice(0, -1));
                    }
                    if (pages.length === 0 && e.key === "Escape") {
                      e.preventDefault();
                      setOpen(false);
                    }
                  }}
                  className="flex flex-col gap-2 rounded-lg bg-white shadow-xl dark:bg-slate-800"
                >
                  <div className="flex items-center gap-1 px-2 pt-2">
                    <RippleButton
                      onClick={() => setPages([])}
                      tabIndex={-1}
                      className="rounded bg-neutral-200 px-1 py-0.5 text-sm transition-transform duration-200 active:scale-95 dark:bg-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <IconHome size={16} />
                        <span>Home</span>
                      </div>
                    </RippleButton>
                    {pages.map((page, id) => {
                      return (
                        <React.Fragment key={id}>
                          <RippleButton
                            tabIndex={-1}
                            className="rounded bg-neutral-200 px-1 py-0.5 text-sm transition-transform duration-200 active:scale-95 dark:bg-slate-700 dark:text-slate-200"
                            onClick={() => {
                              if (
                                pages.length - pages.indexOf(page) - 1 !==
                                0
                              ) {
                                setPages((pages) =>
                                  pages.slice(
                                    0,
                                    pages.length - pages.indexOf(page) - 1,
                                  ),
                                );
                              }
                            }}
                          >
                            {page}
                          </RippleButton>
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder={getInputPlaceholder()}
                    className="border-b px-3.5 py-1 outline-none placeholder:text-slate-500 dark:border-slate-500  dark:bg-slate-800 dark:text-slate-200"
                  />
                  <Command.List className="max-h-none overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-green-900/50 scrollbar-thumb-rounded hover:scrollbar-thumb-green-900 dark:text-slate-200 dark:scrollbar-thumb-slate-500 dark:hover:scrollbar-thumb-slate-600 sm:max-h-96">
                    <Command.Empty>
                      No results found for '{search}'
                    </Command.Empty>
                    {!page && (
                      <>
                        <Command.Item
                          onSelect={(e) => {
                            generateScramble();
                            setOpen(false);
                          }}
                          className="flex select-none items-center justify-between rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <IconReload
                              size={18}
                              className="text-neutral-400 dark:text-slate-400"
                            />
                            <span>Generate Scramble</span>
                          </div>
                        </Command.Item>
                        <Command.Item
                          onSelect={() => {
                            setPages([...pages, "delete solve"]);
                            setSearch("");
                          }}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconTrash
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>Delete Solve</span>
                        </Command.Item>
                        <Command.Item
                          onSelect={() => {
                            setPages([...pages, "theme"]);
                            setSearch("");
                          }}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconDeviceDesktop
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>Theme</span>
                        </Command.Item>
                        <Command.Item
                          onSelect={() => {
                            setPages([...pages, "scramble visualization"]);
                            setSearch("");
                          }}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconPerspective
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>Scramble Visualization</span>
                        </Command.Item>

                        <Command.Item
                          onSelect={() => {
                            setPages([...pages, "create session"]);
                            setSearch("");
                          }}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconPlus
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>Create New Session</span>
                        </Command.Item>
                        <Command.Item
                          onSelect={() => {
                            setPages([...pages, "rename session"]);
                            setSearch("");
                          }}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconForms
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>Rename Session</span>
                        </Command.Item>
                        <Command.Item
                          onSelect={() => {
                            setPages([...pages, "delete session"]);
                            setSearch("");
                          }}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconTrash
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>Delete Session</span>
                        </Command.Item>
                      </>
                    )}
                    {page === "delete solve" &&
                      sessionSolves.map((solve, id) => {
                        return (
                          <Command.Item
                            key={id}
                            onKeyDown={(e) => {
                              console.log(e.key);
                            }}
                            onSelect={(e) => {
                              setOpen(false);
                              setTimeout(() => {
                                setSolveId(solve.id);
                                setIsDeleteSolveModal(true);
                              }, 64);
                            }}
                            className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                          >
                            <span className="text-slate-400">{id}</span>
                            <span className="flex items-center overflow-hidden">
                              {formatTime(solve.solveTime)}
                              {solve.comment.trim() !== "" && (
                                <>
                                  &nbsp;[
                                  <span className="truncate">
                                    {solve.comment}
                                  </span>
                                  ]
                                </>
                              )}
                            </span>
                          </Command.Item>
                        );
                      })}
                    {page === "theme" && (
                      <>
                        <Command.Item
                          key="light"
                          onSelect={lightTheme}
                          className="select-none rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          Light Theme
                        </Command.Item>
                        <Command.Item
                          key="dark"
                          onSelect={darkTheme}
                          className="select-none rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          Dark Theme
                        </Command.Item>
                      </>
                    )}
                    {page === "scramble visualization" && (
                      <>
                        <Command.Item
                          key="2D"
                          onSelect={() => setTwistyVisualization("2D")}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconSquare
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>2D</span>
                        </Command.Item>
                        <Command.Item
                          key="3D"
                          onSelect={() => setTwistyVisualization("3D")}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <IconCube
                            size={18}
                            className="text-neutral-400 dark:text-slate-400"
                          />
                          <span>3D</span>
                        </Command.Item>
                      </>
                    )}
                    {page === "create session" && (
                      <>
                        <Command.Item
                          key="createSession"
                          value={search}
                          onSelect={createNewSession}
                          className="select-none rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          {search !== "" ? `Create Session: ${search}` : ""}
                        </Command.Item>
                      </>
                    )}
                    {page === "rename session" &&
                      Object.keys(sessionData.sessions).map((e, id) => {
                        return (
                          <Command.Item
                            key={e}
                            onSelect={() => setPages((prev) => [...prev, e])}
                            className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                          >
                            <span className="text-slate-400">{id}</span>
                            <span>{e}</span>
                          </Command.Item>
                        );
                      })}
                    {pages.includes("rename session") &&
                      Object.keys(sessionData.sessions).includes(page) && (
                        <Command.Item
                          key="renameSession"
                          onSelect={() => renameSession(page, search)}
                          className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                        >
                          <span>
                            Rename Session: {page} &rarr; {search}
                          </span>
                        </Command.Item>
                      )}
                    {page === "delete session" &&
                      Object.keys(sessionData.sessions).map((session, id) => {
                        return (
                          <Command.Item
                            key={id}
                            value={session}
                            onSelect={(keyToDelete) =>
                              deleteSession(keyToDelete)
                            }
                            className="flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700"
                          >
                            <span className="text-slate-400">{id}</span>
                            <span className="flex items-center overflow-hidden">
                              {session}
                            </span>
                          </Command.Item>
                        );
                      })}
                  </Command.List>
                </Command>
              </Dialog.Content>
            </m.div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default CommandMenu;
