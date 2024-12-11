import { useState, useEffect } from 'react';

export const useCommandMenu = (setDisableTimerInput) => {
  const [open, setOpen] = useState(false);
  const [value, onValueChange] = useState('');
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState([]);
  const page = pages[pages.length - 1];

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    setSearch('');
    setDisableTimerInput(open);
  }, [open, setDisableTimerInput]);

  const navigateBack = () => {
    setPages((pages) => pages.slice(0, -1));
    setSearch('');
  };

  const navigateToPage = (pageName) => {
    setPages((prev) => [...prev, pageName]);
    setSearch('');
  };

  const resetNavigation = () => {
    setPages([]);
    setSearch('');
  };

  return {
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
    resetNavigation
  };
};

export default useCommandMenu;
