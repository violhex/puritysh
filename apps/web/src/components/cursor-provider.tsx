"use client";

import { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function CursorProvider({ children }: { children: React.ReactNode }) {
  const profileId = null;

  const { data } = useQuery({
    ...trpc.cursor.list.queryOptions({ profileId }),
  });

  useEffect(() => {
    if (data && data.length > 0) {
      document.body.style.cursor = `url(${data[0].src}), auto`;
    } else {
      document.body.style.cursor = "auto";
    }
  }, [data]);

  return <>{children}</>;
} 