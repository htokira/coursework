import type { Metadata } from "next";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

import "./globals.css";

export const metadata: Metadata = {
    title: "Image Modification Detector",
    description:
        "Система виявлення та локалізації модифікацій зображень",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk">
            <body>
                <div className="app-layout">
                    <Header />

                    <Sidebar />

                    <div className="content-wrapper">
                        {children}
                    </div>

                    <Footer />
                </div>
            </body>
        </html>
    );
}