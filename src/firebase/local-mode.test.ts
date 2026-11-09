import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

it("does not initialize Firebase or authenticate even when deployment keys exist", async () => {
  vi.stubEnv("VITE_FIREBASE_API_KEY", "local-mode-test");
  vi.stubEnv("VITE_FIREBASE_APP_ID", "local-mode-test");
  vi.stubEnv("VITE_FIREBASE_MESSAGE_SENDER_ID", "local-mode-test");
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockRejectedValue(new Error("Unexpected network request"));
  const { auth, app } = await import("./config");
  const { getApps } = await import("firebase/app");
  expect(auth).toBeUndefined();
  expect(app).toBeUndefined();
  expect(getApps()).toHaveLength(0);
  const { useFirebaseAuth } = await import("./useFirebaseAuth");
  const actions = useFirebaseAuth();
  await expect(
    actions.signIn("local@example.invalid", "unused"),
  ).rejects.toThrow("disabled in local mode");
  await expect(actions.signInWithGoogle()).rejects.toThrow(
    "disabled in local mode",
  );
  await expect(
    actions.signUp("local@example.invalid", "unused", "Local"),
  ).rejects.toThrow("disabled in local mode");
  await expect(actions.resetPassword("local@example.invalid")).rejects.toThrow(
    "disabled in local mode",
  );
  await expect(actions.signOut()).rejects.toThrow("disabled in local mode");
  expect(fetch).not.toHaveBeenCalled();
});
