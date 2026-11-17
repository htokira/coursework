import type { Modification } from "../../services/analysisService";
import ModificationCard from "./ModificationCard";

interface Props {
    modifications: Modification[];
}

export default function ModificationList({ modifications }: Props) {
    return (
        <section className="modifications-section">
            <div className="result-section-heading">
                <h2>Деталі виявлених модифікацій</h2>
            </div>

            {modifications.length === 0 ? (
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
                    {modifications.map((item, index) => (
                        <ModificationCard
                            key={item.id}
                            modification={item}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
