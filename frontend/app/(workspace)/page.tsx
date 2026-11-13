import UploadArea from "@/components/UploadArea/UploadArea";

export default function Home() {
    return (
        <main className="main-content">
            <div className="page-heading">
                <div>
                    <span className="page-eyebrow">
                        РОБОЧИЙ ПРОСТІР
                    </span>

                    <h1>Головна</h1>
                    
                </div>
            </div>

            <UploadArea />
        </main>
    );
}