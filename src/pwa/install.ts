import { useSyncExternalStore } from "react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
const standalone = window.matchMedia("(display-mode: standalone)");
const listeners = new Set<() => void>();
let promptEvent: InstallEvent | null = null;
let state = {
  available: false,
  installed:
    standalone.matches ||
    !!(navigator as Navigator & { standalone?: boolean }).standalone,
  offlineReady: false,
  updateReady: false,
};
function update(changes: Partial<typeof state>) {
  state = { ...state, ...changes };
  listeners.forEach((listener) => listener());
}
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  promptEvent = event as InstallEvent;
  update({ available: true });
});
window.addEventListener("appinstalled", () => {
  promptEvent = null;
  update({ installed: true, available: false });
});
standalone.addEventListener("change", () =>
  update({ installed: standalone.matches }),
);

export function useInstallation() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => state,
  );
}

export async function installApp() {
  const event = promptEvent;
  if (!event) return;
  promptEvent = null;
  update({ available: false });
  await event.prompt();
  await event.userChoice;
  // Only appinstalled proves installation; accepting the dialog is insufficient.
}

export async function registerOfflineApp() {
  if (
    !import.meta.env.PROD ||
    !window.isSecureContext ||
    !("serviceWorker" in navigator)
  )
    return;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none",
    });
    if (registration.waiting) update({ updateReady: true });
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller)
          update({ updateReady: true });
      });
    });
    await navigator.serviceWorker.ready;
    update({ offlineReady: true });
  } catch {
    // Online use and local lists remain available if registration/cache fails.
    update({ offlineReady: false });
  }
}
