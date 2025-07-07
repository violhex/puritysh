import React from "react";
import { toast } from "sonner";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import { Window, WindowHeader, WindowContent, Button } from "react95";

export interface R95ToastProps {
  title: string;
  message: string;
  duration?: number;
}

export function showR95Toast({ title, message, duration = 8000 }: R95ToastProps) {
  toast.custom((t) => (
    <ThemeProvider theme={original}>
      <div className="relative">
        <Window variant="outside" style={{ width: 220 }}>
          <WindowHeader className="flex justify-between items-center select-none px-2 h-6 text-xs">
            <span>{title}</span>
            <Button
              className="p-0 w-4 h-4 flex items-center justify-center"
              onClick={() => toast.dismiss(t)}
            >
              ✕
            </Button>
          </WindowHeader>
          <WindowContent className="p-2 text-xs">{message}</WindowContent>
        </Window>
      </div>
    </ThemeProvider>
  ), { duration });
} 