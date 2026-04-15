export type UserRole = "admin" | "reviewer" | "issuer" | "investor" | "stakeholder";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const SESSION_COOKIE = "land_records_session";

export const demoUsers: DemoUser[] = [
  { id: "user-admin", name: "Admin User", email: "admin@land.local", role: "admin", password: "admin123" },
  { id: "user-reviewer", name: "Review Officer", email: "reviewer@land.local", role: "reviewer", password: "reviewer123" },
  { id: "user-issuer", name: "Issuer User", email: "issuer@land.local", role: "issuer", password: "issuer123" },
  { id: "user-investor", name: "Investor User", email: "investor@land.local", role: "investor", password: "investor123" },
  { id: "user-stakeholder", name: "Stakeholder User", email: "stakeholder@land.local", role: "stakeholder", password: "stakeholder123" },
];

export function toSessionUser(user: DemoUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function findDemoUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return demoUsers.find((user) => user.email === normalizedEmail && user.password === password);
}

export function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

export function decodeSession(value?: string | null): SessionUser | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionUser;
    if (!parsed.id || !parsed.email || !parsed.role) return null;
    if (!demoUsers.some((user) => user.id === parsed.id && user.role === parsed.role)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request): SessionUser | null {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`));

  return decodeSession(cookie?.slice(SESSION_COOKIE.length + 1));
}

export function hasRole(user: SessionUser | null, allowed: UserRole[]) {
  return Boolean(user && allowed.includes(user.role));
}

export function requireRole(request: Request, allowed: UserRole[]) {
  const user = getSessionFromRequest(request);
  if (!user) {
    return { user: null, response: Response.json({ error: "Authentication required" }, { status: 401 }) };
  }
  if (!hasRole(user, allowed)) {
    return { user, response: Response.json({ error: "Insufficient role permissions" }, { status: 403 }) };
  }
  return { user, response: null };
}
