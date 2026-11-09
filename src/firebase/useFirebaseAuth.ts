import { UserCredential } from "@firebase/auth";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { CLOUD_ACCOUNTS_ENABLED } from "./account-mode";
import { auth } from "./config.ts";

export type FirebaseAuthFunctions = {
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

function requireCloudAuth() {
  if (!CLOUD_ACCOUNTS_ENABLED || !auth) {
    throw new Error("Cloud accounts are disabled in local mode.");
  }
  return auth;
}

export const useFirebaseAuth: () => FirebaseAuthFunctions = () => {
  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    await createUserWithEmailAndPassword(
      requireCloudAuth(),
      email,
      password,
    ).then(({ user }) => updateProfile(user, { displayName }));
  };

  const resetPassword = async (email: string) =>
    await sendPasswordResetEmail(requireCloudAuth(), email);

  const signIn = async (email: string, password: string) =>
    await signInWithEmailAndPassword(requireCloudAuth(), email, password);

  const signInWithGoogle = async () =>
    await signInWithPopup(requireCloudAuth(), new GoogleAuthProvider());

  const signOutWrapper = async () => {
    await signOut(requireCloudAuth());
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut: signOutWrapper,
    resetPassword,
  };
};
