import type { AnalysisRecord } from "../services/analysisService";

interface Props {
    analysis: AnalysisRecord;
}

export default function AnalysisResult({ analysis }: Props) {
    const { result } = analysis;

    const verdictInfo = {
        authentic: {
            label: "Ознак модифікації не виявлено",
            color: "green",
        },
        suspicious: {
            label: "Виявлено підозрілі області",
            color: "yellow",
        },
        modified: {
            label: "Виявлено ознаки модифікації",
            color: "red",
        },
    };

    const verdict = verdictInfo[result.verdict];

    return (
        <div className="analysis-result">
            <section className="result-overview">
                <div className="result-verdict">
                    <div>
                        <span className="result-label">
                            ЗАГАЛЬНИЙ РЕЗУЛЬТАТ
                        </span>

                        <h2>{verdict.label}</h2>
                    </div>

                    <span className={`verdict-badge ${verdict.color}`}>
                        {result.verdict === "authentic"
                            ? "Низький рівень"
                            : result.verdict === "suspicious"
                            ? "Середній рівень"
                            : "Високий рівень"}
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

            <section className="result-image-section">
                <div className="result-section-heading">
                    <h2>Локалізація модифікацій</h2>

                    <span>
                        {result.modifications.length} підозрілих областей
                    </span>
                </div>

                <div className="result-image-wrapper">
                    <img
                        src={analysis.imageUrl}
                        alt={analysis.fileName}
                        className="result-image"
                    />

                    {result.modifications.map((modification, index) => (
                        <div
                            key={modification.id}
                            className="modification-region"
                            style={{
                                left: `${modification.region.x}%`,
                                top: `${modification.region.y}%`,
                                width: `${modification.region.width}%`,
                                height: `${modification.region.height}%`,
                            }}
                        >
                            <span>{index + 1}</span>
                        </div>
                    ))}
                </div>

                <div className="region-legend">
                    <span className="legend-box" />
                    <span>Області з потенційними модифікаціями</span>
                </div>
            </section>

            <section className="modifications-section">
                <div className="result-section-heading">
                    <h2>Деталі виявлених модифікацій</h2>
                </div>

                {result.modifications.length === 0 ? (
                    <div className="no-modifications">
                        <div className="no-modifications-icon">✓</div>

                        <h3>Підозрілих областей не виявлено</h3>

                        <p>
                            У межах демонстраційного сценарію
                            не було визначено виражених ознак
                            модифікації.
                        </p>
                    </div>
                ) : (
                    <div className="modification-list">
                        {result.modifications.map((item, index) => (
                            <div
                                className="modification-card"
                                key={item.id}
                            >
                                <div className="modification-number">
                                    {index + 1}
                                </div>

                                <div className="modification-content">
                                    <div className="modification-title">
                                        <h3>{item.label}</h3>

                                        <span>
                                            {item.confidence}% впевненості
                                        </span>
                                    </div>

                                    <p>{item.description}</p>

                                    <div className="confidence-track">
                                        <div
                                            style={{
                                                width: `${item.confidence}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="region-coordinates">
                                        Область: X {item.region.x}%,
                                        Y {item.region.y}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="conclusion-section">
                <h2>Висновок дослідження</h2>

                <p>{result.conclusion}</p>
            </section>
        </div>
    );
}