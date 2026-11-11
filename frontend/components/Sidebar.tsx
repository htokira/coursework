import Link from "next/link";
import Image from 'next/image';
import homeIcon from '../public/home.png'
import historyIcon from '../public/history.png'

const navigationItems = [
    {
        title: "Головна",
        href: "/",
        icon: (
            <Image
                src={homeIcon}
                alt="Picture of home outline"
                placeholder="blur"/>
        ),
        active: true,
    },
    {
        title: "Історія аналізів",
        href: "/history",
        icon: (
            <Image
                src={historyIcon}
                alt="Picture of home outline"
                placeholder="blur"/>
        ),
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <span className="sidebar-label">РОБОЧИЙ ПРОСТІР</span>

                <nav className="sidebar-navigation">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${
                                item.active ? "active" : ""
                            }`}>
                            <span className="sidebar-link-icon">
                                {item.icon}
                            </span>

                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    )
}