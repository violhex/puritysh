"use client";

import { OuterBezel } from "./OuterBezel";
import { BrandingLabel } from "./BrandingLabel";
import { DirectoryLabel } from "./DirectoryLabel";
import dynamic from "next/dynamic";

// Lazy-load AppBar to avoid SSR mismatch before its full implementation
const AppBar = dynamic(() => import("../appbar/AppBar"), { ssr: false });

export interface ScreenFrameProps {
  className?: string;
  withAppBar?: boolean;
  path?: string;
  children: React.ReactNode;
}

export function ScreenFrame({
  children,
  withAppBar = true,
  className,
  path,
}: ScreenFrameProps) {
  return (
    <div className="relative h-svh w-svw overflow-hidden bg-black">
      <OuterBezel className={className} />
      <BrandingLabel />
      <DirectoryLabel path={path} />
      <div className="relative z-40 size-full overflow-hidden">{children}</div>
      {withAppBar && <AppBar accent="#8f8f8f" />}
    </div>
  );
}

export default ScreenFrame; 