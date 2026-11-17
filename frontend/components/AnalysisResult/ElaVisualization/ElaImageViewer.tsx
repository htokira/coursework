
import type { RefObject } from "react";

interface Props {
    imageUrl: string;
    fileName: string;
    isProcessing: boolean;
    hasResult: boolean;
    imageRef: RefObject<HTMLImageElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    onImageLoad: () => void;
    onImageError: () => void;
}

export default function ElaImageViewer({
    imageUrl,
    fileName,
    isProcessing,
    hasResult,
    imageRef,
    canvasRef,
    onImageLoad,
    onImageError,
}: Props) {
    return (
        <div className="ela-comparison">
            <div className="ela-image-panel">
                <h3>Оригінальне зображення</h3>

                <div className="ela-image-frame">
                    <img
                        key={imageUrl}
                        ref={imageRef}
                        src={imageUrl}
                        alt={fileName}
                        onLoad={onImageLoad}
                        onError={onImageError}
                    />
                </div>
            </div>

            <div className="ela-image-panel">
                <h3>Результат ELA</h3>

                <div className="ela-image-frame ela-result-frame">
                    <canvas ref={canvasRef} />

                    {!hasResult && !isProcessing && (
                        <div className="ela-placeholder">
                            Очікування результату
                        </div>
                    )}

                    {isProcessing && (
                        <div className="ela-loading">
                            Обробка зображення...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}