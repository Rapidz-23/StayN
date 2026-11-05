import { createContext, useContext, useState } from "react";
import { useData } from "./DataContext";

// Fake sign-in for the front-end demo: any password works for the sample accounts until a password is set
// (by signing up or by changing it). The Firebase step replaces login/register/logout/changePassword with
// Firebase Auth calls (signInWithEmailAndPassword, createUserWithEmailAndPassword, reauthenticateWithCredential + updatePassword).
const AuthContext = createContext(null);
const KEY = "stayn-demo-user";

const readSaved = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
const save = (id) => {
  try { id ? localStorage.setItem(KEY, id) : localStorage.removeItem(KEY); } catch { /* ignore */ }
};

export function AuthProvider({ children }) {
  const { users, applications, addUser, updateUser } = useData();
  const [userId, setUserId] = useState(readSaved());
  const [passwords, setPasswords] = useState({}); // demo only: userId -> password, lost on refresh
  const user = users.find((u) => u.id === userId) || null;
  const application = user ? applications.find((a) => a.id === user.id) : null;

  const login = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { ok: false, error: "No account found with that email." };
    if (password !== undefined && passwords[found.id] !== undefined && passwords[found.id] !== password)
      return { ok: false, error: "Wrong email or password." };
    if (found.status === "suspended") return { ok: false, error: "Your account is suspended. Contact the StayN team." };
    setUserId(found.id); save(found.id);
    return { ok: true, user: found };
  };

  const register = ({ name, email, phone, password }) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      return { ok: false, error: "That email already has an account." };
    const created = addUser({ name, email: email.trim(), phone });
    setPasswords((p) => ({ ...p, [created.id]: password }));
    setUserId(created.id); save(created.id);
    return { ok: true, user: created };
  };

  const logout = () => { setUserId(null); save(null); };

  // Used by guests and hosts. A sample account that has no saved password accepts any current password.
  const changePassword = (current, next) => {
    if (!user) return { ok: false, error: "Log in again to change your password." };
    const saved = passwords[user.id];
    if (saved !== undefined && saved !== current) return { ok: false, error: "Your current password is not correct." };
    setPasswords((p) => ({ ...p, [user.id]: next }));
    return { ok: true };
  };
  const verifyEmail = () => user && updateUser(user.id, { emailVerified: true });

  const homePath = !user ? "/" : user.role === "admin" ? "/admin" : user.role === "host" ? "/host" : "/reservations";

  return (
    <AuthContext.Provider value={{ user, application, login, register, logout, changePassword, verifyEmail, homePath }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
