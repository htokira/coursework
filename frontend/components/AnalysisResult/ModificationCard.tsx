import type { Modification } from "../../services/analysisService";

interface Props {
    modification: Modification;
    index: number;
}

export default function ModificationCard({
    modification,
    index,
}: Props) {
    const { label, confidence, description, region } = modification;

    return (
        <div className="modification-card">
            <div className="modification-number">
                {index + 1}
            </div>

            <div className="modification-content">
                <div className="modification-title">
                    <h3>{label}</h3>

                    <span>{confidence}% впевненості</span>
                </div>

                <p>{description}</p>

                <div className="confidence-track">
                    <div
                        style={{
                            width: `${confidence}%`,
                        }}
                    />
                </div>

                <span className="region-coordinates">
                    Область: X {region.x}%, Y {region.y}%
                </span>
            </div>
        </div>
    );
}
