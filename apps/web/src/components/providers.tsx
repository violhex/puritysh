"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/utils/trpc";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import CursorProvider from "./cursor-provider";
import { WindowManagerProvider } from "./contexts/window-manager";


export default function Providers({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WindowManagerProvider>
        <QueryClientProvider client={queryClient}>
          <CursorProvider>
            {children}
          </CursorProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </WindowManagerProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
