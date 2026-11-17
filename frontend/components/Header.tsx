"use client";

import Link from "next/link"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    getCurrentUser,
    logout,
    type AuthUser,
} from "../services/authService";

export default function Header() {
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    useEffect(() => {
        const updateUser = () => {
            setUser(getCurrentUser());
        };

        updateUser();

        window.addEventListener("auth-changed", updateUser);

        return () => {
            window.removeEventListener("auth-changed", updateUser);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        router.push("/login");
    };

    return (
        <header className="header">
            <Link href="/">
                <span className="logo-title">IMAGE MODIFICATION DETECTION</span>
            </Link>

            <div className="header-actions">
                { user ? (
                    <>
                        <div className="header-profile">
                            <div className="profile-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="profile-info">
                                <span className="profile-name">
                                    {user.name}
                                </span>
                                <span className="profile-role">
                                    {user.email}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="header-icon-button"
                            onClick={handleLogout}
                            aria-label="Вийти з облікового запису"
                            title="Вийти">
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M10 17l5-5-5-5" />
                                <path d="M15 12H3" />
                                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                            </svg>
                        </button>
                    </>

                ) : (
                    <Link href="/login" className="header-profile">
                        <div className="profile-avatar">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M5 21a7 7 0 0 1 14 0" />
                            </svg>
                        </div>

                        <div className="profile-info">
                            <span className="profile-name">Користувач</span>
                            <span className="profile-role">Увійти в акаунт</span>
                        </div>
                    </Link>
                )}
            </div>
        </header>
    )
}