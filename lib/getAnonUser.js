// lib/getAnonUser.js
import { cookies } from "next/headers";

export function getAnonUser() {
  const cookieStore = cookies();
  const anon = cookieStore.get("anon_user");

  if (!anon) return null;

  try {
    return JSON.parse(anon.value);
  } catch {
    return null;
  }
}
