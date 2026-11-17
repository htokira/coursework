import type { AnalysisRecord } from "../../services/analysisService";

import ResultOverview from "./ResultOverview";
import ElaVisualization from "./ElaVisualization/ElaVisualization";
import ModificationList from "./ModificationList";
import AnalysisConclusion from "./AnalysisConclusion";

interface Props {
    analysis: AnalysisRecord;
}

export default function AnalysisResult({ analysis }: Props) {
    const { result } = analysis;

    return (
        <div className="analysis-result">
            <ResultOverview result={result} />

            <ElaVisualization
                imageUrl={analysis.imageUrl}
                fileName={analysis.fileName}
            />

            <ModificationList
                modifications={result.modifications}
            />

            <AnalysisConclusion
                conclusion={result.conclusion}
            />
        </div>
    );
}
