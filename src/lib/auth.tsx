import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppUser = {
  name: string;
  email: string;
  isOrganizer: boolean;
};

type AuthContextValue = {
  user: AppUser | null;
  signIn: (payload: { email: string; password: string }) => void;
  signUp: (payload: { name: string; email: string; password: string; isOrganizer: boolean }) => void;
  signOut: () => void;
};

const STORAGE_KEY = "aracaju-auth-user";

const AuthContext = createContext<AuthContextValue | null>(null);

function getNameFromEmail(email: string) {
  const [localPart] = email.split("@");
  if (!localPart) return "Visitante";

  return localPart
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setUser(JSON.parse(stored) as AppUser);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: ({ email }) => {
        setUser({
          name: getNameFromEmail(email),
          email,
          isOrganizer: false,
        });
      },
      signUp: ({ name, email, isOrganizer }) => {
        setUser({
          name: name.trim() || getNameFromEmail(email),
          email,
          isOrganizer,
        });
      },
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
