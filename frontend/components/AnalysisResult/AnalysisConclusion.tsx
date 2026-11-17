interface Props {
    conclusion: string;
}

export default function AnalysisConclusion({
    conclusion,
}: Props) {
    return (
        <section className="conclusion-section">
            <h2>Висновок дослідження</h2>

            <p>{conclusion}</p>
        </section>
    );
}
