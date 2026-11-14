"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AnalysisResult from "@/components/AnalysisResult";

import {
    getPendingImage,
    runDemoAnalysis,
    getAnalysisById,
    type AnalysisRecord,
    type PendingImage,
} from "@/services/analysisService";

import { getCurrentUser } from "@/services/authService";

export default function AnalysisPage() {
    const [image, setImage] = useState<PendingImage | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);

    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState("");
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();

        const email = user?.email ?? "user@example.com";

        const params = new URLSearchParams(window.location.search);
        const analysisId = params.get("id");

        if (analysisId) {
            const existing = getAnalysisById(analysisId, email);

            if (existing) {
                setAnalysis(existing);
            } else {
                setError("Аналіз не знайдено.");
            }
        } else {
            setImage(getPendingImage());
        }

        setInitialized(true);
    }, []);

    const handleAnalysis = () => {
        if (!image) return;

        setError("");
        setIsRunning(true);

        try {
            const user = getCurrentUser();

            const record = runDemoAnalysis(
                image,
                user?.email ?? "user@example.com"
            );

            setAnalysis(record);
            setImage(null);
        } catch {
            setError(
                "Не вдалося зберегти результати аналізу."
            );
        } finally {
            setIsRunning(false);
        }
    };

    if (!initialized) {
        return (
            <main className="main-content">
                <p>Завантаження...</p>
            </main>
        );
    }

    return (
        <main className="main-content analysis-page">
            <div className="page-heading">
                <span className="page-eyebrow">
                    ДОСЛІДЖЕННЯ ЗОБРАЖЕНЬ
                </span>

                <h1>
                    {analysis ? "Результати аналізу" : "Аналіз зображення"}
                </h1>

                <p>
                    Перегляд характеристик зображення та результатів
                    дослідження можливих модифікацій.
                </p>
            </div>

            {error && (
                <div className="upload-error">
                    {error}
                </div>
            )}

            {analysis ? (
                <>
                    <div className="analysis-file-header">
                        <div>
                            <span>Досліджуваний файл</span>
                            <h2>{analysis.fileName}</h2>
                        </div>

                        <Link href="/history" className="secondary-button">
                            До історії
                        </Link>
                    </div>

                    <AnalysisResult analysis={analysis} />

                    <div className="analysis-bottom-actions">
                        <Link href="/" className="secondary-button">
                            Новий аналіз
                        </Link>

                        <Link href="/history" className="analysis-button">
                            Переглянути історію
                        </Link>
                    </div>
                </>
            ) : image ? (
                <section className="analysis-start-card">
                    <div className="analysis-file-header">
                        <div>
                            <span>Обране зображення</span>
                            <h2>{image.fileName}</h2>
                        </div>

                        <span className="preview-status">
                            <span className="status-dot" />
                            Готове до аналізу
                        </span>
                    </div>

                    <div className="analysis-start-image">
                        <img
                            src={image.imageUrl}
                            alt={image.fileName}
                        />
                    </div>

                    <div className="analysis-file-details">
                        <div>
                            <span>Формат</span>
                            <strong>
                                {image.fileName.split(".").pop()?.toUpperCase()}
                            </strong>
                        </div>

                        <div>
                            <span>Розмір</span>
                            <strong>
                                {(image.fileSize / (1024 * 1024)).toFixed(2)} МБ
                            </strong>
                        </div>

                        <div>
                            <span>Роздільна здатність</span>
                            <strong>
                                {image.width} × {image.height}
                            </strong>
                        </div>
                    </div>

                    <div className="analysis-start-actions">
                        <button
                            type="button"
                            className="analysis-button"
                            disabled={isRunning}
                            onClick={handleAnalysis}
                        >
                            {isRunning
                                ? "Виконується аналіз..."
                                : "Розпочати аналіз"}
                        </button>

                        <Link href="/" className="remove-button">
                            Скасувати
                        </Link>
                    </div>

                    {isRunning && (
                        <div className="analysis-progress">
                            <div className="analysis-progress-bar" />

                            <p>
                                Виконується демонстраційне дослідження...
                            </p>
                        </div>
                    )}
                </section>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">⌕</div>

                    <h2>Зображення не вибрано</h2>

                    <p>
                        Щоб розпочати дослідження, спочатку
                        завантажте зображення на головній сторінці.
                    </p>

                    <Link href="/" className="analysis-button">
                        Завантажити зображення
                    </Link>
                </div>
            )}
        </main>
    );
}