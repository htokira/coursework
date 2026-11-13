import { useState, useEffect, useRef } from "react";

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

    return {
        image,
        error,
        isDragging,
        setIsDragging,
        inputRef,
        processFile,
        removeImage,
        setError,
    };
}