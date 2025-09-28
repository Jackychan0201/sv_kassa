export const login = async (username: string, password: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username, password }),
    credentials: "include", 
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};

export const logout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include", 
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
};
