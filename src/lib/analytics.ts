"use client";

const CONSENT_KEY = "caneli-analytics-consent";

export type ConsentValue = "accepted" | "declined";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function setConsent(value: ConsentValue) {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("caneli-consent-changed", { detail: value }));
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Pushes an event to window.dataLayer (Google Tag Manager / GA4), but only
 * once the visitor has accepted analytics cookies. If GTM isn't configured
 * (no NEXT_PUBLIC_GTM_ID) or consent hasn't been given, this is a no-op —
 * it never throws, so it's safe to call from anywhere in the UI.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
