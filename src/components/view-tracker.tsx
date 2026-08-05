"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ViewTracker({ event, params }: { event: string; params?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
