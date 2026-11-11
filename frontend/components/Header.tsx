import Link from "next/link"
import Image from 'next/image'
import userDefault from '../public/user.png'

export default function Header() {
    return (
        <header className="header">
            <Link href="/">
                <span className="logo-title">IMAGE MODIFICATION DETECTION</span>
            </Link>

            <div className="header-actions">
                <Link href="/profile" className="header-profile">
                    <div className="profile-avatar">
                        <Image
                            src={userDefault}
                            alt="Picture of the user profile"
                            placeholder="blur"/>
                    </div>

                    <div className="profile-info">
                        <span className="profile-name">Користувач</span>
                        <span className="profile-role">Особистий кабінет</span>
                    </div>
                </Link>
            </div>
        </header>
    )
}