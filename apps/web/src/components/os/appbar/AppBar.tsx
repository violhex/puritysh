"use client";

export default function AppBar({ accent = "#8f8f8f" }: { accent?: string }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex h-[45px] items-center border-t"
      style={{ backgroundColor: accent }}
    >
      {/* TODO: Build full AppBar */}
    </div>
  );
} 