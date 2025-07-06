"use client";

import React from "react";
import { Button } from "react95";
import { cn } from "@/lib/utils";

const R95Icon: React.FC<{ name: string }> = ({ name }) => (
  <span className={cn(name, "inline-block w-8 h-8 bg-contain")}></span>
);

const HelpButton: React.FC = () => (
  <Button
    disabled
    aria-disabled="true"
    title="Help (coming soon)"
    className="p-0 w-[45px] h-[45px] flex items-center justify-center"
  >
    <R95Icon name="HelpBook_32x32_4" />
  </Button>
);

export default HelpButton; 