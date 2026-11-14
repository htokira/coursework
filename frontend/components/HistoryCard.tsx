import Link from "next/link";
import type { AnalysisRecord } from "../services/analysisService";

interface Props {
    analysis: AnalysisRecord;
    onDelete: (id: string) => void;
}

export default function HistoryCard({ analysis, onDelete }: Props) {
    const verdictLabels = {
        authentic: "Ознак модифікації не виявлено",
        suspicious: "Підозрілі області",
        modified: "Виявлено модифікації",
    };

    const verdict = analysis.result.verdict;

    const date = new Date(analysis.createdAt).toLocaleString("uk-UA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <article className="history-card">
            <Link
                href={`/analysis?id=${analysis.id}`}
                className="history-image"
            >
                <img
                    src={analysis.imageUrl}
                    alt={analysis.fileName}
                />
            </Link>

            <div className="history-card-content">
                <div className="history-card-top">
                    <div>
                        <h3>{analysis.fileName}</h3>
                        <span>{date}</span>
                    </div>

                    <span className={`history-verdict ${verdict}`}>
                        {verdict === "authentic"
                            ? "Без ознак"
                            : verdict === "suspicious"
                            ? "Підозріле"
                            : "Модифіковане"}
                    </span>
                </div>

                <p className="history-conclusion">
                    {analysis.result.conclusion}
                </p>

                <div className="history-card-bottom">
                    <div className="history-metadata">
                        <span>
                            Індекс підозрілості:
                            <strong>
                                {" "}{analysis.result.suspiciousScore}%
                            </strong>
                        </span>

                        <span>
                            Областей:
                            <strong>
                                {" "}{analysis.result.modifications.length}
                            </strong>
                        </span>
                    </div>

                    <div className="history-actions">
                        <Link
                            href={`/analysis?id=${analysis.id}`}
                            className="history-view-button"
                        >
                            Переглянути
                        </Link>

                        <button
                            type="button"
                            className="history-delete-button"
                            onClick={() => onDelete(analysis.id)}
                            aria-label="Видалити аналіз"
                            title="Видалити аналіз"
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}