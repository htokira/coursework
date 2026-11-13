"use client";

import { RefObject } from "react";
import Image from "next/image";
import { ImageInfo } from "./useImageUpload";

interface ImagePreviewProps {
    image: ImageInfo;
    inputRef: RefObject<HTMLInputElement | null>;
    onRemove: () => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImagePreview({
    image,
    inputRef,
    onRemove,
    onChange,
}: ImagePreviewProps) {
    const formatSize = (bytes: number) => {
        return bytes >= 1024 * 1024
            ? `${(bytes / (1024 * 1024)).toFixed(2)} МБ`
            : `${(bytes / 1024).toFixed(2)} КБ`;
    };

    const getFileExtension = (type: string, name: string) => {
        if (type && type.includes("/")) {
            return type.split("/")[1].toUpperCase();
        }
        const parts = name.split(".");
        return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
    };

    return (
        <div className="preview-container">
            <div className="preview-header">
                <div>
                    <h2>Попередній перегляд</h2>
                    <p>Зображення готове до подальшої обробки</p>
                </div>

                <span className="preview-status">
                    <span className="status-dot" />
                    Завантажено
                </span>
            </div>

            <div className="preview-image-wrapper">
                <Image
                    src={image.preview}
                    alt="Попередній перегляд зображення"
                    width={image.width}
                    height={image.height}
                    unoptimized
                    className="preview-image"
                />
            </div>

            <div className="file-information">
                <div className="file-information-item">
                    <span>Назва файлу</span>
                    <strong title={image.file.name}>{image.file.name}</strong>
                </div>

                <div className="file-information-item">
                    <span>Формат</span>
                    <strong>{getFileExtension(image.file.type, image.file.name)}</strong>
                </div>

                <div className="file-information-item">
                    <span>Розмір файлу</span>
                    <strong>{formatSize(image.file.size)}</strong>
                </div>

                <div className="file-information-item">
                    <span>Роздільна здатність</span>
                    <strong>
                        {image.width} × {image.height}
                    </strong>
                </div>
            </div>

            <div className="preview-actions">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => inputRef.current?.click()}
                >
                    Замінити зображення
                </button>

                <button
                    type="button"
                    className="remove-button"
                    onClick={onRemove}
                >
                    Видалити
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onChange}
            />

            <p className="preview-notice">
                Функція аналізу зображення буде доступна після підключення відповідного модуля.
            </p>
        </div>
    );
}