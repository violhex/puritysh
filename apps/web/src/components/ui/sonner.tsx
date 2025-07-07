"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import "@react95/icons/icons.css";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      visibleToasts={3}
      className="z-[1000]"
      toastOptions={{
        classNames: {
          toast: "flex items-start gap-2 bg-[#c0c0c0] text-black border border-black shadow-[inset_-2px_-2px_0_0_#000] p-2 font-home-video",
          description: "text-xs",
          actionButton: "react95_button",
        },
        duration: 8000,
      }}
      {...props}
    />
  );
};

export { Toaster };
