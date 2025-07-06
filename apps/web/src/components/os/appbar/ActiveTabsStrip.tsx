"use client";

import React from "react";
import { Button } from "react95";
import { cn } from "@/lib/utils";

export interface WindowTask {
  id: string;
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface TabsStripProps {
  tasks: WindowTask[];
  onSelect?: (id: string) => void;
  className?: string;
}

const ActiveTabsStrip: React.FC<TabsStripProps> = ({ tasks, onSelect, className }) => (
  <div className={cn("flex gap-1 whitespace-nowrap overflow-x-auto", className)}>
    {tasks.map((task) => (
      <Button
        key={task.id}
        active={task.active}
        onClick={() => onSelect?.(task.id)}
        variant={task.active ? "flat" : undefined}
        style={{ maxWidth: 160 }}
      >
        {task.icon && <span className="mr-1">{task.icon}</span>}
        <span className="truncate">{task.title}</span>
      </Button>
    ))}
  </div>
);

export default React.memo(ActiveTabsStrip); 