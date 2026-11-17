"use client";

import { useEffect, useRef, useState } from "react";
import { generateEla, type ElaOptions, } from "../../../utils/ela";

import ElaSettings from "./ElaSettings";
import ElaImageViewer from "./ElaImageViewer";

interface Props {
    imageUrl: string;
    fileName: string;
}

const DEFAULT_OPTIONS: ElaOptions = {
    quality: 90,
    amplification: 10,
    threshold: 5,
};

export default function ElaVisualization({
    imageUrl,
    fileName,
}: Props) {
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [options, setOptions] = useState<ElaOptions>(
        DEFAULT_OPTIONS
    );

    const [loadedImageUrl, setLoadedImageUrl] = useState<string | null>(
        null
    );

    const [isProcessing, setIsProcessing] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");
        setIsProcessing(false);
        setHasResult(false);

        if (canvasRef.current) {
            canvasRef.current.width = 1;
            canvasRef.current.height = 1;
        }
    }, [imageUrl]);

    useEffect(() => {
        const image = imageRef.current;
        const canvas = canvasRef.current;

        if (
            loadedImageUrl !== imageUrl ||
            !image ||
            !canvas ||
            !image.complete ||
            !image.naturalWidth
        ) {
            return;
        }

        let cancelled = false;

        const processImage = async () => {
            setIsProcessing(true);
            setError("");

            try {
                const result = await generateEla(image, options);

                if (cancelled) return;

                const context = canvas.getContext("2d");

                if (!context) {
                    throw new Error("Не вдалося створити Canvas.");
                }

                canvas.width = result.width;
                canvas.height = result.height;

                const imageData = context.createImageData(
                    result.width,
                    result.height
                );

                imageData.data.set(result.data);
                context.putImageData(imageData, 0, 0);

                setHasResult(true);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Помилка обробки зображення."
                    );
                    setHasResult(false);
                }
            } finally {
                if (!cancelled) {
                    setIsProcessing(false);
                }
            }
        };

        processImage();

        return () => {
            cancelled = true;
        };
    }, [loadedImageUrl, imageUrl, options]);

    const handleImageLoad = () => {
        const image = imageRef.current;

        if (!image || !image.naturalWidth) {
            setError("Не вдалося завантажити зображення.");
            return;
        }

        setLoadedImageUrl(imageUrl);
    };

    const handleImageError = () => {
        setLoadedImageUrl(null);
        setHasResult(false);
        setError("Не вдалося завантажити оригінальне зображення.");
    };

    const handleOptionChange = (
        key: keyof ElaOptions,
        value: number
    ) => {
        setOptions((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const isJpeg = /\.(jpg|jpeg)$/i.test(fileName);

    return (
        <section className="ela-visualization">

            <ElaSettings
                options={options}
                onChange={handleOptionChange}
                onReset={() => setOptions(DEFAULT_OPTIONS)}
                disabled={isProcessing}
            />

            <ElaImageViewer
                imageUrl={imageUrl}
                fileName={fileName}
                isProcessing={isProcessing}
                hasResult={hasResult}
                imageRef={imageRef}
                canvasRef={canvasRef}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
            />

            {error && (
                <p className="ela-error">{error}</p>
            )}

            {!isJpeg && (
                <p className="ela-notice">
                    Зображення не є JPEG. Для ELA воно буде
                    попередньо перетворене у формат JPEG.
                    Результати слід інтерпретувати обережно.
                </p>
            )}
        </section>
    );
}
