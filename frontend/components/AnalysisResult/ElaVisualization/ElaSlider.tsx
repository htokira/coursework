interface Props {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}

export default function ElaSlider({
    label,
    value,
    min,
    max,
    onChange,
}: Props) {
    return (
        <div className="ela-control">
            <div className="ela-control-heading">
                <label>{label}</label>
                <span>{value}</span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(event) =>
                    onChange(Number(event.target.value))
                }
            />

            <div className="ela-range-labels">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
}
