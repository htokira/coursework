"use client";

import { RefObject } from "react";

interface DropZoneProps {
    inputRef: RefObject<HTMLInputElement | null>;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DropZone({
    inputRef,
    isDragging,
    setIsDragging,
    onDrop,
    onChange,
}: DropZoneProps) {
    return (
        <div
            className={`upload-area ${isDragging ? "dragging" : ""}`}
            onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
            }}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    inputRef.current?.click();
                }
            }}
            aria-label="Обрати зображення для завантаження"
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onChange}
            />

            <div className="upload-icon">
                <svg
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
                </svg>
            </div>

            <h2>
                {isDragging
                    ? "Відпустіть файл для завантаження"
                    : "Завантажте зображення для аналізу"}
            </h2>

            <p className="upload-description">
                Перетягніть файл у цю область або скористайтеся кнопкою нижче, щоб обрати його зі свого пристрою.
            </p>

            <button
                type="button"
                className="upload-button"
                onClick={(event) => {
                    event.stopPropagation();
                    inputRef.current?.click();
                }}
            >
                Обрати зображення
            </button>

            <div className="upload-formats">
                <span>JPG</span>
                <span>JPEG</span>
                <span>PNG</span>
            </div>
        </div>
    );
}