"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface SafeAvatarProps {
  src: string;
  size?: number;
  className?: string;
}

const SafeAvatar: React.FC<SafeAvatarProps> = ({ src, size = 28, className }) => (
  <img
    src={src}
    width={size}
    height={size}
    alt="avatar"
    className={cn("inline-block rounded-full object-cover aspect-square", className)}
  />
);

export default SafeAvatar; 