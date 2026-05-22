import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type OrganizerCompany = {
  companyName: string;
  cnpj: string;
  status: "approved";
};

export type PendingOrganizerSignUp = {
  name: string;
  email: string;
  password: string;
};

export type AppUser = {
  name: string;
  email: string;
  isOrganizer: boolean;
  organizerCompany?: OrganizerCompany;
};

type AuthContextValue = {
  user: AppUser | null;
  pendingOrganizerSignUp: PendingOrganizerSignUp | null;
  signIn: (payload: { email: string; password: string }) => void;
  signUp: (payload: {
    name: string;
    email: string;
    password: string;
    isOrganizer: boolean;
    organizerCompany?: OrganizerCompany;
  }) => void;
  startOrganizerSignUp: (payload: PendingOrganizerSignUp) => void;
  completeOrganizerSignUp: (payload: OrganizerCompany) => void;
  clearPendingOrganizerSignUp: () => void;
  signOut: () => void;
};

const STORAGE_KEY = "aracaju-auth-user";
const PENDING_ORGANIZER_STORAGE_KEY = "aracaju-auth-pending-organizer";

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
  const [pendingOrganizerSignUp, setPendingOrganizerSignUp] = useState<PendingOrganizerSignUp | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AppUser);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    const storedPendingOrganizer = window.sessionStorage.getItem(PENDING_ORGANIZER_STORAGE_KEY);
    if (!storedPendingOrganizer) return;

    try {
      setPendingOrganizerSignUp(JSON.parse(storedPendingOrganizer) as PendingOrganizerSignUp);
    } catch {
      window.sessionStorage.removeItem(PENDING_ORGANIZER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!pendingOrganizerSignUp) {
      window.sessionStorage.removeItem(PENDING_ORGANIZER_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(PENDING_ORGANIZER_STORAGE_KEY, JSON.stringify(pendingOrganizerSignUp));
  }, [pendingOrganizerSignUp]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      pendingOrganizerSignUp,
      signIn: ({ email }) => {
        setUser({
          name: getNameFromEmail(email),
          email,
          isOrganizer: false,
        });
      },
      signUp: ({ name, email, isOrganizer, organizerCompany }) => {
        setUser({
          name: name.trim() || getNameFromEmail(email),
          email,
          isOrganizer,
          organizerCompany: isOrganizer ? organizerCompany : undefined,
        });
      },
      startOrganizerSignUp: ({ name, email, password }) => {
        setPendingOrganizerSignUp({
          name: name.trim() || getNameFromEmail(email),
          email,
          password,
        });
      },
      completeOrganizerSignUp: ({ companyName, cnpj, status }) => {
        if (!pendingOrganizerSignUp) return;

        setUser({
          name: pendingOrganizerSignUp.name.trim() || getNameFromEmail(pendingOrganizerSignUp.email),
          email: pendingOrganizerSignUp.email,
          isOrganizer: true,
          organizerCompany: {
            companyName: companyName.trim(),
            cnpj: cnpj.trim(),
            status,
          },
        });
        setPendingOrganizerSignUp(null);
      },
      clearPendingOrganizerSignUp: () => setPendingOrganizerSignUp(null),
      signOut: () => {
        setUser(null);
        setPendingOrganizerSignUp(null);
      },
    }),
    [pendingOrganizerSignUp, user],
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
