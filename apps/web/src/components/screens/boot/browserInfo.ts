export function getSystemString(): string {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "SSR";
  // Edge middleware may inject this global; fallback keeps SSR safe
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = (globalThis as any).__USER_IP__ ?? "0.0.0.0";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const net = typeof navigator !== "undefined" && (navigator as any).connection?.downlink
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).connection.downlink
    : "?";
  return `user-agent=(${ua}); ip=(${ip}); net-speed=(${net}Mbps);`;
}

interface DiagLine {
  label: string;
  value: unknown;
  ok: boolean;
}

export function collectDiag(): DiagLine[] {
  if (typeof window === "undefined") return [];
  const result: DiagLine[] = [
    {
      label: "Browser",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: (navigator as any).userAgentData?.brands?.[0]?.brand ?? navigator.userAgent,
      ok: true,
    },
    { label: "WebGL", value: !!(window as any).WebGL2RenderingContext, ok: true },
    {
      label: "Notifications",
      value: Notification.permission,
      ok: Notification.permission === "granted",
    },
  ];
  return result;
} 