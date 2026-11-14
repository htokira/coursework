"use client";

import { useEffect, useMemo, useState } from "react";

import HistoryCard from "@/components/HistoryCard";

import {
    getAnalyses,
    deleteAnalysis,
    type AnalysisRecord,
} from "@/services/analysisService";

import { getCurrentUser } from "@/services/authService";

type FilterType = "all" | "authentic" | "suspicious" | "modified";

export default function HistoryPage() {
    const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();

        const email = user?.email ?? "user@example.com";

        setAnalyses(getAnalyses(email));
        setInitialized(true);
    }, []);

    const filteredAnalyses = useMemo(() => {
        return analyses.filter((analysis) => {
            const matchesSearch = analysis.fileName
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesFilter =
                filter === "all" ||
                analysis.result.verdict === filter;

            return matchesSearch && matchesFilter;
        });
    }, [analyses, search, filter]);

    const handleDelete = (id: string) => {
        const confirmed = window.confirm(
            "Ви дійсно бажаєте видалити цей аналіз?"
        );

        if (!confirmed) return;

        const user = getCurrentUser();

        deleteAnalysis(
            id,
            user?.email ?? "user@example.com"
        );

        setAnalyses((previous) =>
            previous.filter((item) => item.id !== id)
        );
    };

    const totalCount = analyses.length;

    const suspiciousCount = analyses.filter(
        (item) => item.result.verdict !== "authentic"
    ).length;

    if (!initialized) {
        return (
            <main className="main-content">
                <p>Завантаження історії...</p>
            </main>
        );
    }

    return (
        <main className="main-content history-page">
            <div className="page-heading">
                <span className="page-eyebrow">
                    ОСОБИСТИЙ РОБОЧИЙ ПРОСТІР
                </span>

                <h1>Історія аналізів</h1>

                <p>
                    Переглядайте результати попередніх досліджень
                    та повертайтеся до збережених звітів.
                </p>
            </div>

            <section className="history-section">
                <div className="history-toolbar">
                    <div className="history-search">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m16 16 5 5" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Пошук за назвою файлу..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(event) =>
                            setFilter(event.target.value as FilterType)
                        }
                    >
                        <option value="all">Усі результати</option>
                        <option value="authentic">
                            Без виражених ознак
                        </option>
                        <option value="suspicious">Підозрілі</option>
                        <option value="modified">Модифіковані</option>
                    </select>
                </div>

                <div className="history-results-heading">
                    <h2>Збережені дослідження</h2>

                    <span>
                        Знайдено: {filteredAnalyses.length}
                    </span>
                </div>

                {filteredAnalyses.length > 0 ? (
                    <div className="history-list">
                        {filteredAnalyses.map((analysis) => (
                            <HistoryCard
                                key={analysis.id}
                                analysis={analysis}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">⌕</div>

                        <h2>
                            {analyses.length === 0
                                ? "Історія поки порожня"
                                : "Нічого не знайдено"}
                        </h2>

                        <p>
                            {analyses.length === 0
                                ? "Завантажте зображення та проведіть перший аналіз."
                                : "Спробуйте змінити пошуковий запит або фільтр."}
                        </p>

                        {analyses.length === 0 && (
                            <a href="/" className="analysis-button">
                                Новий аналіз
                            </a>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}