import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface WindowTask {
  id: string;
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  parentId?: string | null;
  /** Window type affects layering and behavior */
  type?: "normal" | "modal" | "system" | "menu";
  /** Non-closable windows (like ConsentForm) */
  closable?: boolean;
  /** Custom z-index override */
  zIndex?: number;
  /** Position preference for window stacking */
  position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

interface WindowManagerCtx {
  tasks: WindowTask[];
  activeId: string | null;
  /** Current z-index counter for dynamic stacking */
  nextZIndex: number;
  /** Map of window IDs to shake animation states */
  shakeStates: Record<string, boolean>;
  register(task: Omit<WindowTask, "active">): void;
  unregister(id: string): void;
  restore(id: string): void;
  minimise(id: string): void;
  /** Bring window to front (highest z-index) */
  bringToFront(id: string): void;
  /** Check if window can be closed */
  canClose(id: string): boolean;
  /** Attempt to close with error feedback */
  attemptClose(id: string): boolean;
  /** Cycle to next window (Ctrl+Tab) */
  cycleNext(): void;
  /** Cycle to previous window (Ctrl+Shift+Tab) */
  cyclePrevious(): void;
  /** Trigger shake animation for a window */
  triggerShake(id: string): void;
}

const WindowManagerContext = createContext<WindowManagerCtx | undefined>(undefined);

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<WindowTask[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100); // Start above AppBar layer
  const [shakeStates, setShakeStates] = useState<Record<string, boolean>>({});

  const register = useCallback((task: Omit<WindowTask, "active">) => {
    setTasks((prev) => {
      if (prev.find((t) => t.id === task.id)) return prev;
      
      // Calculate appropriate z-index based on window type
      let zIndex = task.zIndex;
      if (!zIndex) {
        switch (task.type) {
          case "system":
            zIndex = 200; // Highest for system dialogs
            break;
          case "modal":
            zIndex = 150; // High for modals
            break;
          case "menu":
            zIndex = 120; // Above normal windows
            break;
          default:
            zIndex = nextZIndex;
            setNextZIndex(prev => prev + 10);
        }
      }
      
      return [...prev, { 
        ...task, 
        active: task.type === "system" || task.type === "modal", // Auto-activate critical windows
        closable: task.closable ?? true, // Default to closable
        zIndex 
      }];
    });
  }, [nextZIndex]);

  const unregister = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setActiveId((prev) => (prev === id ? null : prev));
    // Clean up shake state
    setShakeStates((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const restore = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: true } : { ...t, active: false })),
    );
    setActiveId(id);
  }, []);

  const minimise = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, active: false } : t)));
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setTasks((prev) => {
      const newZIndex = Math.max(...prev.map(t => t.zIndex || 0)) + 10;
      return prev.map((t) => 
        t.id === id ? { ...t, active: true, zIndex: newZIndex } : { ...t, active: false }
      );
    });
    setActiveId(id);
    setNextZIndex(prev => prev + 20);
  }, []);

  const canClose = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    return task?.closable !== false;
  }, [tasks]);

  const triggerShake = useCallback((id: string) => {
    setShakeStates(prev => ({ ...prev, [id]: true }));
    // Reset shake state after animation
    setTimeout(() => {
      setShakeStates(prev => ({ ...prev, [id]: false }));
    }, 500);
  }, []);

  const attemptClose = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;
    
    if (task.closable === false) {
      console.log(`Cannot close ${task.title} - required action pending`);
      
      // Trigger shake animation
      triggerShake(id);
      
      // Future: Trigger error sound
      // useSoundFxQueue().add("error-beep");
      
      return false;
    }
    
    unregister(id);
    return true;
  }, [tasks, unregister, triggerShake]);

  const cycleNext = useCallback(() => {
    const parentTasks = tasks.filter(t => !t.parentId);
    if (parentTasks.length === 0) return;
    
    const currentIndex = parentTasks.findIndex(t => t.id === activeId);
    const nextIndex = (currentIndex + 1) % parentTasks.length;
    bringToFront(parentTasks[nextIndex].id);
  }, [tasks, activeId, bringToFront]);

  const cyclePrevious = useCallback(() => {
    const parentTasks = tasks.filter(t => !t.parentId);
    if (parentTasks.length === 0) return;
    
    const currentIndex = parentTasks.findIndex(t => t.id === activeId);
    const prevIndex = currentIndex <= 0 ? parentTasks.length - 1 : currentIndex - 1;
    bringToFront(parentTasks[prevIndex].id);
  }, [tasks, activeId, bringToFront]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          cyclePrevious();
        } else {
          cycleNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [cycleNext, cyclePrevious]);

  const value: WindowManagerCtx = { 
    tasks, 
    activeId, 
    nextZIndex,
    shakeStates,
    register, 
    unregister, 
    restore, 
    minimise,
    bringToFront,
    canClose,
    attemptClose,
    cycleNext,
    cyclePrevious,
    triggerShake
  };
  
  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
};

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("WindowManagerProvider missing in tree");
  return ctx;
}

// Hook to get shake state for a specific window
export function useWindowShake(windowId: string) {
  const { shakeStates } = useWindowManager();
  return shakeStates[windowId] || false;
}

// ---------- Helper hook / HOC ----------

export function useWindowRegistration(task: Omit<WindowTask, "active"> | undefined) {
  const { register, unregister } = useWindowManager();
  React.useEffect(() => {
    if (!task) return;
    register(task);
    return () => unregister(task.id);
  }, [register, unregister, task]);
}

export function withWindow(taskMeta: Omit<WindowTask, "id" | "active">) {
  return function <P extends object>(Comp: React.ComponentType<P>): React.FC<P> {
    return (props: P) => {
      const idRef = React.useRef<string>(crypto.randomUUID()).current;
      useWindowRegistration({ id: idRef, ...taskMeta });
      return <Comp {...props} />;
    };
  };
} 