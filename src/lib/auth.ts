import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type AuthUser = {
  id?: string;
  email?: string | null;
};

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }

    const client = supabase;

    const getSession = async () => {
      if (!client) return;
      const {
        data: { session },
      } = await client.auth.getSession();
      setUser(session?.user ?? null);
    };

    void getSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  return supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function resetPassword(email: string) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth`,
  });
}

export async function signOutUser() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
