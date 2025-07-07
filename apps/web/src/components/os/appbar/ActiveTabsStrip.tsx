"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "react95";
import { cn } from "@/lib/utils";
import { useWindowManager } from "@/components/contexts/window-manager";
import { APPBAR_BUTTON_CLASS } from "./AppBar";

const ParentTile: React.FC<{
  task: ReturnType<typeof useWindowManager>["tasks"][number];
  onSelect(id: string): void;
  isFocused: boolean;
  onFocus: () => void;
}> = ({ task, onSelect, isFocused, onFocus }) => (
  <Button
    {...(task.active && { active: true })}
    variant={task.active ? "flat" : undefined}
    onClick={() => onSelect(task.id)}
    onFocus={onFocus}
    className={cn(
      APPBAR_BUTTON_CLASS, 
      "max-w-[160px] min-w-[72px] px-2 py-1 flex-shrink-0",
      isFocused && "ring-2 ring-blue-500 ring-offset-1"
    )}
    role="tab"
    tabIndex={isFocused ? 0 : -1}
    aria-selected={task.active}
    aria-label={`Window: ${task.title}`}
  >
    {task.icon && <span className="mr-1">{task.icon}</span>}
    <span className="truncate text-xs">{task.title}</span>
  </Button>
);

const ChildTile: React.FC<{
  task: ReturnType<typeof useWindowManager>["tasks"][number];
  onSelect(id: string): void;
  isFocused: boolean;
  onFocus: () => void;
}> = ({ task, onSelect, isFocused, onFocus }) => (
  <Button
    {...(task.active && { active: true })}
    variant={task.active ? "flat" : "ghost"}
    onClick={() => onSelect(task.id)}
    onFocus={onFocus}
    className={cn(
      "max-w-[140px] min-w-[64px] h-[18px] px-2 py-0.5 flex-shrink-0 text-[10px]",
      isFocused && "ring-1 ring-blue-400 ring-offset-1"
    )}
    role="tab"
    tabIndex={isFocused ? 0 : -1}
    aria-selected={task.active}
    aria-label={`Child window: ${task.title}`}
  >
    {task.icon && <span className="mr-1">{task.icon}</span>}
    <span className="truncate">{task.title}</span>
  </Button>
);

const ActiveTabsStrip: React.FC<{ 
  className?: string;
  onTaskClick?: (id: string) => void;
}> = ({ className, onTaskClick }) => {
  const { tasks, restore, minimise, activeId } = useWindowManager();
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // group by parentId
  const grouped = React.useMemo(() => {
    const top = tasks.filter((t) => !t.parentId);
    return top.map((p) => ({
      parent: p,
      children: tasks.filter((c) => c.parentId === p.id),
    }));
  }, [tasks]);

  // All tasks in render order for keyboard navigation
  const allTasksInOrder = React.useMemo(() => {
    const result: string[] = [];
    grouped.forEach(({ parent, children }) => {
      result.push(parent.id);
      children.forEach(child => result.push(child.id));
    });
    return result;
  }, [grouped]);

  const handleSelect = (id: string) => {
    if (onTaskClick) {
      onTaskClick(id);
    } else {
      if (id === activeId) minimise(id);
      else restore(id);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!stripRef.current?.contains(document.activeElement)) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = focusedTaskId ? allTasksInOrder.indexOf(focusedTaskId) : -1;
        let nextIndex;
        
        if (e.key === 'ArrowRight') {
          nextIndex = currentIndex < allTasksInOrder.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : allTasksInOrder.length - 1;
        }
        
        if (allTasksInOrder[nextIndex]) {
          setFocusedTaskId(allTasksInOrder[nextIndex]);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedTaskId) {
          handleSelect(focusedTaskId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedTaskId, allTasksInOrder, handleSelect]);

  return (
    <div
      ref={stripRef}
      role="tablist"
      aria-label="Open windows"
      className={cn(
        "flex gap-1 whitespace-nowrap overflow-x-auto items-start",
        className,
      )}
    >
      {grouped.map(({ parent, children }) => (
        <div key={parent.id} className="flex flex-col items-start gap-0.5">
          <ParentTile 
            task={parent} 
            onSelect={handleSelect}
            isFocused={focusedTaskId === parent.id}
            onFocus={() => setFocusedTaskId(parent.id)}
          />
          {children.length > 0 && (
            <div className="flex flex-col ml-4 gap-0.5">
              {children.map((c) => (
                <ChildTile 
                  key={c.id} 
                  task={c} 
                  onSelect={handleSelect}
                  isFocused={focusedTaskId === c.id}
                  onFocus={() => setFocusedTaskId(c.id)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(ActiveTabsStrip); 