export const ADMIN_USERNAMES = [
    "admin",
    "chand",
];

export const getUserRole = (username?: string | null): "student" | "admin" =>
    username && ADMIN_USERNAMES.includes(username.toLowerCase()) ? "admin" : "student";
