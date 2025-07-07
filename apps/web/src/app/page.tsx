"use client";

import { useEffect, useState } from "react";
import ScreenFrame from "@/components/os/frame/ScreenFrame";
import { Screen } from "@/components/os/screen";

export default function Home() {
  const [bootDone, setBootDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ScreenFrame
      withAppBar={!bootDone}
      path={mounted ? (bootDone ? "~/desktop" : "~/boot") : undefined}
    >
      {!bootDone ? (
        <Screen current="boot" onBootFinish={() => setBootDone(true)} />
      ) : (
        <Screen current="content">
          <main className="flex h-full w-full items-center justify-center">
            <p className="text-white">Welcome to PurityOS</p>
          </main>
        </Screen>
      )}
    </ScreenFrame>
  );
}
