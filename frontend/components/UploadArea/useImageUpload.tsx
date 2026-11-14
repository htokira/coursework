import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    savePendingImage,
    type PendingImage,
} from "@/services/analysisService";

export interface ImageInfo {
    file: File;
    preview: string;
    width: number;
    height: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export function useImageUpload() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<ImageInfo | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        return () => {
            if (image?.preview) {
                URL.revokeObjectURL(image.preview);
            }
        };
    }, [image]);

    const processFile = (file?: File) => {
        setError("");
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Непідтримуваний формат. Оберіть JPG, PNG або JPG.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Розмір файлу не повинен перевищувати 10 МБ.");
            return;
        }

        const preview = URL.createObjectURL(file);
        const img = new window.Image();

        img.onload = () => {
            setImage({
                file,
                preview,
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };

        img.onerror = () => {
            URL.revokeObjectURL(preview);
            setError("Не вдалося відкрити зображення.");
        };

        img.src = preview;
    };

    const removeImage = () => {
        setImage(null);
        setError("");
    };

    const prepareImage = async (file: File): Promise<string> => {
    const source = URL.createObjectURL(file);

        try {
            const img = new window.Image();

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(
                    new Error("Не вдалося прочитати зображення")
                );

                img.src = source;
            });

            const maxDimension = 1400;

            const scale = Math.min(
                1,
                maxDimension / Math.max(img.naturalWidth, img.naturalHeight)
            );

            const canvas = document.createElement("canvas");

            canvas.width = Math.round(img.naturalWidth * scale);
            canvas.height = Math.round(img.naturalHeight * scale);

            const context = canvas.getContext("2d");

            if (!context) {
                throw new Error("Не вдалося обробити зображення");
            }

            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            return canvas.toDataURL("image/jpeg", 0.75);
        } finally {
            URL.revokeObjectURL(source);
        }
    };

    const startAnalysis = async () => {
        if (!image) return;

        try {
            const imageUrl = await prepareImage(image.file);

            const pendingImage: PendingImage = {
                fileName: image.file.name,
                imageUrl,
                fileSize: image.file.size,
                width: image.width,
                height: image.height,
            };

            savePendingImage(pendingImage);

            router.push("/analysis");
        } catch {
            setError(
                "Не вдалося підготувати зображення. Спробуйте інший файл."
            );
        }
    };

    return {
        image,
        error,
        isDragging,
        setIsDragging,
        inputRef,
        processFile,
        removeImage,
        setError,
        startAnalysis,
    };
}