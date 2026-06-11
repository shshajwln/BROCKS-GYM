"use client";

import dynamic from "next/dynamic";
import type { Machine } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center bg-slate2 font-mono text-xs uppercase tracking-widest text-stone2/60">
      Loading map&hellip;
    </div>
  ),
});

export default function MapWrapper({ machines }: { machines: Machine[] }) {
  return <LeafletMap machines={machines} />;
}
