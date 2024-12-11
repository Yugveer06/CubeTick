import React from 'react';
import { Command } from 'cmdk';

const CommandMenuItem = ({ icon: Icon, label, onSelect, className = '', keywords = '' }) => {
  return (
    <Command.Item
      onSelect={onSelect}
      value={`${label} ${keywords}`}
      className={`flex select-none items-center gap-2 rounded p-1 [&[data-selected='true']]:bg-neutral-100 [&[data-selected='true']]:dark:bg-slate-700 ${className}`}
    >
      {Icon && (
        <Icon
          size={18}
          className="text-neutral-400 dark:text-slate-400"
        />
      )}
      <span>{label}</span>
    </Command.Item>
  );
};

export default CommandMenuItem;
