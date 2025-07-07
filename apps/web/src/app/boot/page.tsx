"use client";

import { useRouter } from "next/navigation";
import ScreenFrame from "@/components/os/frame/ScreenFrame";
import { BootRouter } from "@/components/screens/boot";

export default function BootPage() {
  const router = useRouter();
  return (
    <ScreenFrame withAppBar={false} path="~/boot">
      <BootRouter onDone={() => router.push("/dashboard")} />
    </ScreenFrame>
  );
} 