"use client";

import Link from "next/link"
import Image from 'next/image'
import userDefault from '../public/user.png'
import leaveIcon from '../public/leave.png'
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
        setUser(getCurrentUser());
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
                            <Image
                                src={leaveIcon}
                                alt="Picture of the user profile"
                                placeholder="blur"/>
                        </button>
                    </>

                ) : (
                    <Link href="/login" className="header-profile">
                        <div className="profile-avatar">
                            <Image
                                src={userDefault}
                                alt="Picture of the user profile"
                                placeholder="blur"/>
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