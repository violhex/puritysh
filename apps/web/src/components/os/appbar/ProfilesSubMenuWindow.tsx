import React from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  MenuList,
  MenuListItem,
  Button,
  Separator,
} from "react95";
import { withWindow } from "@/components/contexts/window-manager";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import { cn } from "@/lib/utils";
import type { StartMenuItem } from "./StartMenuPanel";
import SafeAvatar from "./SafeAvatar";

interface ProfilesSubMenuWindowProps {
  item: StartMenuItem; // the 'profiles' StartMenuItem containing children
  className?: string;
  onTogglePreview: (p: StartMenuItem) => void;
  onSelect: (id: string) => void; // kept for compatibility with StartMenuPanel
  onClose?: () => void;
}

const ProfilesSubMenuWindow: React.FC<ProfilesSubMenuWindowProps> = ({
  item,
  className,
  onTogglePreview,
  onSelect: _onSelect,
  onClose,
}) => (
  <ThemeProvider theme={original}>
    <Window
      variant="outside"
      className={cn(
        "startmenu-border startmenu-bevel w-72 sm:w-64", // consistent width with StartMenuPanel
        className,
      )}
      role="menu"
      aria-label="Profiles submenu"
    >
      {/* Header */}
      <WindowHeader
        className="flex justify-between items-center select-none"
        onDoubleClick={onClose}
      >
        <span>{item.label}</span>
        <Button
          onClick={onClose}
          className="p-0 w-6 h-6 flex items-center justify-center"
        >
          ✕
        </Button>
      </WindowHeader>

      {/* Inset menu area (matches StartMenuPanel) */}
      <WindowContent className="p-2">
        <div className="mx-auto w-64 sm:w-56 border border-[#fff] shadow-[inset_-2px_-2px_0_0_#000] bg-[#dcdcdc]">
          <MenuList className="w-full block" style={{ width: "100%" }}>
            {item.children?.map((child, idx) => (
              <React.Fragment key={child.id}>
                <MenuListItem
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => onTogglePreview(child)}
                  className="pr-4 pl-2 w-full cursor-pointer"
                >
                  {/* avatar or icon */}
                  {child.avatarSrc ? (
                    <SafeAvatar src={child.avatarSrc} size={28} className="mr-2" />
                  ) : (
                    child.icon && <span className="mr-2">{child.icon}</span>
                  )}

                  <span className="flex-1 truncate text-left">{child.label}</span>

                  {/* arrow indicator if further action */}
                  <span className="ml-2">›</span>
                </MenuListItem>

                {/* divider except last item */}
                {idx < (item.children?.length ?? 0) - 1 && (
                  <Separator className="bg-black h-[2px] my-1" />
                )}
              </React.Fragment>
            ))}
          </MenuList>
        </div>
      </WindowContent>
    </Window>
  </ThemeProvider>
);

export default withWindow({
  title: "Profiles Submenu",
  icon: <span className="User2_16x16_4 inline-block w-4 h-4 bg-contain" />,
  type: "menu",
  parentId: "startmenu",
})(ProfilesSubMenuWindow); 