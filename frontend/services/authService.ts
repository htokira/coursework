import initialUsersData from "../data/users.json";

export interface AuthUser {
    email: string;
    name: string;
    password?: string;
}

const SESSION_KEY = "image_manipulation_user";
const USERS_DB_KEY = "image_manipulation_users_db";

function getUsersDatabase(): AuthUser[] {
    const data = localStorage.getItem(USERS_DB_KEY);
    if (!data) {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(initialUsersData));
        return initialUsersData;
    }
    try {
        return JSON.parse(data) as AuthUser[];
    } catch {
        return [];
    }
}

function saveUsersDatabase(users: AuthUser[]): void {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export function register(
    name: string,
    email: string,
    password?: string
): AuthUser {
    const users = getUsersDatabase();

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        throw new Error("Користувач із такою електронною поштою вже існує.");
    }

    const newUser: AuthUser = { email, name, password };
    
    users.push(newUser);
    saveUsersDatabase(users);

    const sessionUser = { email, name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return sessionUser;
}

export function login(email: string, password?: string): AuthUser {
    const users = getUsersDatabase();

    const user = users.find((u) => u.email === email);

    if (!user) {
        throw new Error("Користувача з такою поштою не знайдено.");
    }

    if (password && user.password && user.password !== password) {
        throw new Error("Невірний пароль.");
    }

    const sessionUser: AuthUser = { email: user.email, name: user.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return sessionUser;
}

export function getCurrentUser(): AuthUser | null {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;

    try {
        return JSON.parse(data) as AuthUser;
    } catch {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function logout(): void {
    localStorage.removeItem(SESSION_KEY);
}