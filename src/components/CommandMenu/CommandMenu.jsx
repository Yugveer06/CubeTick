import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { AnimatePresence, motion as m, useReducedMotion } from "framer-motion";
import React from "react";
import { useAppState } from "../../../store";
import formatTime from "../../utils/formatTime";
import RippleButton from "../RippleButton/RippleButton";
import CommandMenuItem from "./CommandMenuItem";
import {
  getInputPlaceholder,
  getMainMenuItems,
  MENU_PAGES,
} from "./commandMenuConfig";
import useCommandMenu from "./useCommandMenu";
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
import { IconSun } from "@tabler/icons-react";
import { IconMoon } from "@tabler/icons-react";
import { IconMoon2 } from "@tabler/icons-react";
import { IconMoonFilled } from "@tabler/icons-react";
import { IconMoonStars } from "@tabler/icons-react";
import { useToast } from "../../context/ToastContext";

const CommandMenu = ({
  generateScramble,
  sessionData,
  setSessionData,
  sessionSolves,
  setTwistyVisualization,
  setDisableTimerInput,
}) => {
  const { addToast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const [setSolveId, setIsDeleteSolveModal] = useAppState((state) => [
    state.setSolveId,
    state.setIsDeleteSolveModal,
  ]);

  const {
    open,
    setOpen,
    value,
    onValueChange,
    search,
    setSearch,
    pages,
    setPages,
    page,
    navigateBack,
    navigateToPage,
    resetNavigation,
  } = useCommandMenu(setDisableTimerInput);

  const handlers = {
    generateScramble,
    setOpen,
    navigateToPage,
    resetNavigation,
  };

  const lightTheme = () => {
    document.documentElement.classList.remove("dark");
    addToast({
      title: "Light theme selected",
      description: "The light theme has been selected.",
      variant: "success",
    });
    setOpen(false);
    resetNavigation();
  };

  const darkTheme = () => {
    document.documentElement.classList.add("dark");
    addToast({
      title: "Dark theme selected",
      description: "The dark theme has been selected.",
      variant: "success",
    });
    setOpen(false);
    resetNavigation();
  };

  const createNewSession = () => {
    setSessionData((prev) => ({
      ...prev,
      sessions: { ...prev.sessions, [search]: { solves: [] } },
      currentSession: search,
    }));
    addToast({
      title: "Session created",
      description: "A new session has been created and selected.",
      variant: "success",
    });
    resetNavigation();
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
    addToast({
      title: "Session renamed",
      description:
        "The session has been renamed from " + oldName + " to " + newName + ".",
      variant: "success",
    });
    resetNavigation();
    setOpen(false);
  };

  const deleteSession = (keyToDelete) => {
    setSessionData((prev) => {
      const { [keyToDelete]: deletedKey, ...rest } = prev.sessions;
      return {
        ...prev,
        currentSession:
          prev.currentSession === keyToDelete ? "Default" : prev.currentSession,
        sessions: { ...rest },
      };
    });
    addToast({
      title: "Session deleted",
      description: "The session has been deleted.",
      variant: "success",
    });
    resetNavigation();
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
      e.preventDefault();
      setSearch("");
      navigateBack();
    }
    if (pages.length === 0 && e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const renderPageContent = () => {
    if (!page) {
      const mainItems = getMainMenuItems(handlers);
      const searchLower = search.toLowerCase();

      // If no search, just show main menu items
      if (!search) {
        return mainItems.map((item, index) => (
          <CommandMenuItem key={index} {...item} />
        ));
      }

      // First check for exact label matches at the root level
      const rootMatches = mainItems.filter((item) =>
        item.label.toLowerCase().includes(searchLower),
      );

      // If we found matches at root level, return those
      if (rootMatches.length > 0) {
        return rootMatches.map((item, index) => (
          <CommandMenuItem key={index} {...item} />
        ));
      }

      // If no root matches, search through children (next level)
      const getChildMatches = (items) => {
        return items.flatMap((item) => {
          const results = [];

          if (item.children) {
            item.children.forEach((child) => {
              if (
                (child.label + " " + (child.keywords || ""))
                  .toLowerCase()
                  .includes(searchLower)
              ) {
                results.push({
                  ...item,
                  label: `${item.label} → ${child.label}`,
                  onSelect: () => {
                    item.onSelect();
                    setTimeout(() => {
                      if (child.label === "Light Theme") {
                        lightTheme();
                      } else if (child.label === "Dark Theme") {
                        darkTheme();
                      } else if (child.label === "2D") {
                        setTwistyVisualization("2D");
                      } else if (child.label === "3D") {
                        setTwistyVisualization("3D");
                      }
                    }, 50);
                  },
                });
              }
            });
          }

          return results;
        });
      };

      const childMatches = getChildMatches(mainItems);

      return childMatches.map((item, index) => (
        <CommandMenuItem key={index} {...item} />
      ));
    }

    switch (page) {
      case MENU_PAGES.DELETE_SOLVE:
        return sessionSolves.map((solve, id) => (
          <CommandMenuItem
            key={id}
            label={`${id} ${formatTime(solve.solveTime)} ${
              solve.comment.trim() !== "" ? `[${solve.comment}]` : ""
            }`}
            onSelect={() => {
              setOpen(false);
              setTimeout(() => {
                setSolveId(solve.id);
                setIsDeleteSolveModal(true);
              }, 64);
            }}
          />
        ));

      case MENU_PAGES.THEME:
        return (
          <>
            <CommandMenuItem
              icon={IconSun}
              label="Light Theme"
              onSelect={lightTheme}
            />
            <CommandMenuItem
              icon={IconMoonStars}
              label="Dark Theme"
              onSelect={darkTheme}
            />
          </>
        );

      case MENU_PAGES.SCRAMBLE_VISUALIZATION:
        return (
          <>
            <CommandMenuItem
              label="2D"
              icon={IconSquare}
              onSelect={() => {
                setTwistyVisualization("2D");
                addToast({
                  title: "2D visualization selected",
                  variant: "success",
                });
                resetNavigation();
                setOpen(false);
              }}
            />
            <CommandMenuItem
              label="3D"
              icon={IconCube}
              onSelect={() => {
                setTwistyVisualization("3D");
                addToast({
                  title: "3D visualization selected",
                  variant: "success",
                });
                resetNavigation();
                setOpen(false);
              }}
            />
          </>
        );

      case MENU_PAGES.CREATE_SESSION:
        return (
          search !== "" && (
            <CommandMenuItem
              label={`Create Session: ${search}`}
              onSelect={createNewSession}
            />
          )
        );

      case MENU_PAGES.RENAME_SESSION:
        return Object.keys(sessionData.sessions).map((session, id) => (
          <CommandMenuItem
            key={session}
            label={`${id} ${session}`}
            onSelect={() => navigateToPage(session)}
          />
        ));

      case MENU_PAGES.DELETE_SESSION:
        return Object.keys(sessionData.sessions).map((session, id) => (
          <CommandMenuItem
            key={id}
            label={`${id} ${session}`}
            onSelect={() => deleteSession(session)}
          />
        ));

      default:
        if (Object.keys(sessionData.sessions).includes(page)) {
          return (
            <CommandMenuItem
              label={`Rename Session: ${page} → ${search}`}
              onSelect={() => renameSession(page, search)}
            />
          );
        }
        return null;
    }
  };

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
              initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 1.2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  opacity: { duration: 0.1 },
                  scale: { duration: 0.2, ease: [0, 0.75, 0.25, 1] },
                },
              }}
              exit={{
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 0.8,
                transition: {
                  opacity: { duration: 0.1, delay: 0.1 },
                  scale: { duration: 0.2, ease: [0.75, 0, 1, 0.25] },
                },
              }}
              className="fixed top-0 z-[501] w-full min-w-64 max-w-lg sm:top-1/4 sm:w-8/12"
            >
              <Dialog.Content className="rounded-lg bg-gradient-to-r from-green-500 via-green-900 to-blue-900 p-0.5 shadow-2xl dark:from-green-200 dark:via-green-400 dark:to-blue-400">
                <Command
                  value={value}
                  onValueChange={onValueChange}
                  onKeyDown={handleKeyDown}
                  className="flex flex-col gap-2 rounded-lg bg-white shadow-xl dark:bg-slate-800"
                >
                  <div className="flex items-center gap-1 px-2 pt-2">
                    <RippleButton
                      onClick={resetNavigation}
                      tabIndex={-1}
                      className="rounded bg-neutral-200 px-1 py-0.5 text-sm transition-transform duration-200 active:scale-95 dark:bg-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <IconHome size={16} />
                        <span>Home</span>
                      </div>
                    </RippleButton>
                    {pages.map((page, id) => (
                      <RippleButton
                        key={id}
                        tabIndex={-1}
                        className="rounded bg-neutral-200 px-1 py-0.5 text-sm transition-transform duration-200 active:scale-95 dark:bg-slate-700 dark:text-slate-200"
                        onClick={() => {
                          if (pages.length - pages.indexOf(page) - 1 !== 0) {
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
                    ))}
                  </div>
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder={getInputPlaceholder(pages)}
                    className="border-b px-3.5 py-1 outline-none placeholder:text-slate-500 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200"
                  />
                  <Command.List className="max-h-none overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-green-900/50 scrollbar-thumb-rounded hover:scrollbar-thumb-green-900 dark:text-slate-200 dark:scrollbar-thumb-slate-500 dark:hover:scrollbar-thumb-slate-600 sm:max-h-96">
                    <Command.Empty>
                      No results found for '{search}'
                    </Command.Empty>
                    {renderPageContent()}
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
