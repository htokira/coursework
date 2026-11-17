"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navigationItems = [
    {
        title: "Головна",
        href: "/",
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H8v7H4a1 1 0 0 1-1-1z" />
            </svg>
        ),
        active: true,
    },
    {
        title: "Історія аналізів",
        href: "/history",
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v5l3 2" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();


    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <span className="sidebar-label">НАВІГАЦІЯ</span>

                <nav className="sidebar-navigation">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-link ${
                                    isActive ? "active" : ""
                                }`}
                            >
                                <span className="sidebar-link-icon">
                                    {item.icon}
                                </span>

                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    )
}