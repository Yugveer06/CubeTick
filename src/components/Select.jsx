import React from "react";
import * as Select from "@radix-ui/react-select";
import { IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

function SelectComp({ sessionData, setSessionData }) {
  return (
    <Select.Root
      defaultValue="Default"
      value={sessionData.currentSession}
      onValueChange={(e) =>
        setSessionData((prev) => ({ ...prev, currentSession: e }))
      }
    >
      <Select.Trigger
        className="flex items-center gap-2 rounded bg-green-100 px-1 text-green-950 hover:bg-green-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        aria-label="Session"
      >
        <Select.Value />
        <Select.Icon>
          <IconChevronDown size={20} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="absolute z-[61] overflow-hidden rounded bg-green-50 shadow-xl dark:bg-slate-700">
          <Select.ScrollUpButton className="flex items-center justify-center bg-green-300 dark:bg-slate-500">
            <IconChevronUp
              size={20}
              className="text-black dark:text-slate-100"
            />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1">
            {Object.keys(sessionData.sessions).map((item, i) => (
              <SelectItem
                key={i}
                className="flex cursor-default items-center gap-2 rounded px-1 text-black outline-none data-[highlighted]:bg-green-200 data-[disabled]:text-neutral-400 dark:text-slate-100 dark:data-[highlighted]:bg-slate-500/50"
                value={`${item}`}
              >
                {item}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center bg-green-300 dark:bg-slate-500">
            <IconChevronDown
              size={20}
              className="text-black dark:text-slate-100"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item className={className} {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator>
          <IconCheck size={16} />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

export default SelectComp;
