import type { AnalysisRecord } from "../../services/analysisService";

type ResultData = AnalysisRecord["result"];

interface Props {
    result: ResultData;
}

const verdictInfo = {
    authentic: {
        label: "Ознак модифікації не виявлено",
        color: "green",
        level: "Низький рівень",
    },
    suspicious: {
        label: "Виявлено підозрілі області",
        color: "yellow",
        level: "Середній рівень",
    },
    modified: {
        label: "Виявлено ознаки модифікації",
        color: "red",
        level: "Високий рівень",
    },
};

export default function ResultOverview({ result }: Props) {
    const verdict = verdictInfo[result.verdict];

    return (
        <section className="result-overview">
            <div className="result-verdict">
                <div>
                    <span className="result-label">
                        ЗАГАЛЬНИЙ РЕЗУЛЬТАТ
                    </span>

                    <h2>{verdict.label}</h2>
                </div>

                <span className={`verdict-badge ${verdict.color}`}>
                    {verdict.level}
                </span>
            </div>

            <div className="score-section">
                <div className="score-heading">
                    <span>Індекс підозрілості</span>

                    <strong>{result.suspiciousScore}%</strong>
                </div>

                <div className="score-track">
                    <div
                        className={`score-fill ${verdict.color}`}
                        style={{
                            width: `${result.suspiciousScore}%`,
                        }}
                    />
                </div>

                <p>
                    Демонстраційна оцінка наявності ознак
                    можливих модифікацій.
                </p>
            </div>
        </section>
    );
}
