import ElaSlider from "./ElaSlider";

interface ElaOptions {
    quality: number;
    amplification: number;
    threshold: number;
}

interface Props {
    options: ElaOptions;
    onChange: (key: keyof ElaOptions, value: number) => void;
    onReset: () => void;
    disabled?: boolean;
}

export default function ElaSettings({
    options,
    onChange,
    onReset,
    disabled = false,
}: Props) {
    return (
        <div className="ela-settings">
            <div className="ela-settings-header">
                <h3>Налаштування ELA</h3>

                <button
                    className="ela-reset-button"
                    onClick={onReset}
                    disabled={disabled}
                >
                    Скинути
                </button>
            </div>

            <ElaSlider
                label="JPEG Quality"
                value={options.quality}
                min={50}
                max={100}
                onChange={(value) => onChange("quality", value)}
            />

            <ElaSlider
                label="Amplification"
                value={options.amplification}
                min={1}
                max={30}
                onChange={(value) => onChange("amplification", value)}
            />

            <ElaSlider
                label="Threshold"
                value={options.threshold}
                min={0}
                max={30}
                onChange={(value) => onChange("threshold", value)}
            />
        </div>
    );
}
