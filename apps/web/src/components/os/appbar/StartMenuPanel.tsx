"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Window,
  WindowContent,
  MenuList,
  MenuListItem,
  Separator,
  WindowHeader,
  Button,
} from "react95";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import ProfilesSubMenuWindow from "./ProfilesSubMenuWindow";
import ProfilePreviewWindow from "./ProfilePreviewWindow";
import SafeAvatar from "./SafeAvatar";

export interface StartMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  avatarSrc?: string;
  dividerAfter?: boolean;
  /** Optional preview details */
  bannerSrc?: string;
  bio?: string;
  location?: string;
  age?: number;
  rank?: string;
  uid?: number;
  children?: StartMenuItem[];
}

export interface StartMenuPanelProps {
  items: StartMenuItem[];
  onSelect: (id: string) => void;
  onClose?: () => void;
}

/**
 * StartMenuPanel – the drop-down React95 Window that shows Start menu items.
 * Handles focus trap, keyboard arrow navigation and simple mount animation.
 */
const StartMenuPanel: React.FC<StartMenuPanelProps> = ({ items, onSelect, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Track open submenu (first level after top items)
  const [submenuItem, setSubmenuItem] = useState<StartMenuItem | null>(null);
  // Track profile preview (second level)
  const [previewItem, setPreviewItem] = useState<StartMenuItem | null>(null);

  /* ---------- focus first item on mount ---------- */
  useEffect(() => {
    const firstBtn = panelRef.current?.querySelector<HTMLButtonElement>('button[role="menuitem"]');
    firstBtn?.focus();
  }, []);

  /* ---------- arrow-key navigation ---------- */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!panelRef.current?.contains(document.activeElement)) return;
      const current = document.activeElement as HTMLElement | null;
      if (!current) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        (current.parentElement?.nextElementSibling?.querySelector('[role="menuitem"]') as HTMLElement | null)?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        (current.parentElement?.previousElementSibling?.querySelector('[role="menuitem"]') as HTMLElement | null)?.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        const id = current.dataset.id;
        if (id) onSelect(id);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onSelect]);

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        role="menu"
        aria-label="Start menu"
        initial={{ opacity: 0, scale: 0.95, originX: 0, originY: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed bottom-[45px] left-0 z-[120] inline-block"
      >
        <ThemeProvider theme={original}>
          <Window
            variant="outside"
            className={cn(
              "startmenu-border startmenu-bevel w-96 sm:w-72 max-h-[80vh] overflow-y-auto",
            )}
          >
            {/* Window header with title + X */}
            <WindowHeader
              className="flex justify-between items-center select-none"
              onDoubleClick={() => onClose?.()}
            >
              <span>Start Menu</span>
              <Button
                onClick={() => onClose?.()}
                className="p-0 w-6 h-6 flex items-center justify-center"
              >
                ✕
              </Button>
            </WindowHeader>
            <WindowContent className="p-2">
              {/* Inner inset menu area */}
              <div
                className="mx-auto w-64 sm:w-56 border border-[#fff] shadow-[inset_-2px_-2px_0_0_#000] bg-[#dcdcdc]"
              >
                <MenuList className="w-full block" style={{ width: '100%' }}>
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      <MenuListItem
                        role="menuitem"
                        tabIndex={0}
                        data-id={item.id}
                        onClick={() => {
                          if (item.children) {
                            setSubmenuItem((prev) => (prev?.id === item.id ? null : item));
                            setPreviewItem(null);
                          } else {
                            onSelect(item.id);
                          }
                        }}
                        className="pr-4 pl-2 w-full cursor-pointer"
                      >
                        {item.avatarSrc ? (
                          <SafeAvatar src={item.avatarSrc} size={28} className="mr-2" />
                        ) : (
                          item.icon && <span className="mr-2">{item.icon}</span>
                        )}
                        <span className="flex-1 truncate text-left">{item.label}</span>
                        {item.children && <span className="ml-2">›</span>}
                      </MenuListItem>
                      {item.dividerAfter && (
                        <Separator className="bg-black h-[2px] my-1" />
                      )}
                    </React.Fragment>
                  ))}
                </MenuList>
              </div>
            </WindowContent>
          </Window>
        </ThemeProvider>

        {/* ---------- Submenu Window ---------- */}
        {submenuItem && (
          <ProfilesSubMenuWindow
            item={submenuItem}
            className="absolute left-[calc(15px)] top-[-70px] w-64 z-[125]"
            onTogglePreview={(p) =>
              setPreviewItem((prev) => (prev?.id === p.id ? null : p))
            }
            onSelect={onSelect}
            onClose={() => {
              setSubmenuItem(null);
              // keep preview until explicit toggle
            }}
          />
        )}

        {/* ---------- Profile Preview Window (second level) ---------- */}
        {previewItem && (
          <ProfilePreviewWindow
            profile={previewItem}
            className="absolute left-[calc(0.3rem+30px)] top-[-160px] w-72 z-[130]"
            onClose={() => setPreviewItem(null)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StartMenuPanel; 