
export interface ElaOptions {
    quality: number;
    amplification: number;
    threshold: number;
    maxDimension?: number;
}

export interface ElaResult {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

function compressToJpeg(
    canvas: HTMLCanvasElement,
    quality: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Не вдалося стиснути зображення."));
                    return;
                }

                resolve(blob);
            },
            "image/jpeg",
            quality / 100
        );
    });
}

export async function generateEla(
    image: HTMLImageElement,
    options: ElaOptions
): Promise<ElaResult> {
    const {
        quality,
        amplification,
        threshold,
        maxDimension = 1200,
    } = options;

    if (!image.naturalWidth || !image.naturalHeight) {
        throw new Error("Зображення не завантажено.");
    }

    const scale = Math.min(
        1,
        maxDimension / Math.max(
            image.naturalWidth,
            image.naturalHeight
        )
    );

    const width = Math.max(
        1,
        Math.round(image.naturalWidth * scale)
    );

    const height = Math.max(
        1,
        Math.round(image.naturalHeight * scale)
    );

    const originalCanvas = document.createElement("canvas");

    originalCanvas.width = width;
    originalCanvas.height = height;

    const originalContext = originalCanvas.getContext("2d");

    if (!originalContext) {
        throw new Error("Не вдалося створити Canvas.");
    }

    originalContext.fillStyle = "#ffffff";
    originalContext.fillRect(0, 0, width, height);

    originalContext.drawImage(
        image,
        0,
        0,
        width,
        height
    );

    const originalData = originalContext.getImageData(
        0,
        0,
        width,
        height
    );

    const compressedBlob = await compressToJpeg(
        originalCanvas,
        quality
    );

    const compressedBitmap = await createImageBitmap(
        compressedBlob
    );

    try {
        const compressedCanvas = document.createElement("canvas");

        compressedCanvas.width = width;
        compressedCanvas.height = height;

        const compressedContext = compressedCanvas.getContext("2d");

        if (!compressedContext) {
            throw new Error("Не вдалося створити Canvas.");
        }

        compressedContext.drawImage(
            compressedBitmap,
            0,
            0,
            width,
            height
        );

        const compressedData = compressedContext.getImageData(
            0,
            0,
            width,
            height
        );

        const result = new Uint8ClampedArray(
            width * height * 4
        );

        const original = originalData.data;
        const compressed = compressedData.data;

        for (let i = 0; i < original.length; i += 4) {
            const redDiff = Math.abs(
                original[i] - compressed[i]
            );

            const greenDiff = Math.abs(
                original[i + 1] - compressed[i + 1]
            );

            const blueDiff = Math.abs(
                original[i + 2] - compressed[i + 2]
            );

            const difference = (
                redDiff + greenDiff + blueDiff
            ) / 3;

            const adjustedDifference = Math.max(
                0,
                difference - threshold
            );

            const intensity = Math.min(
                255,
                adjustedDifference * amplification
            );

            result[i] = intensity;
            result[i + 1] = intensity;
            result[i + 2] = intensity;
            result[i + 3] = 255;
        }

        return {
            width,
            height,
            data: result,
        };
    } finally {
        compressedBitmap.close();
    }
}
