"use client";

import { useImageUpload } from "./useImageUpload";
import { DropZone } from "./DropZone";
import { ImagePreview } from "./ImagePreview";

export default function UploadArea() {
    const {
        image,
        error,
        isDragging,
        setIsDragging,
        inputRef,
        processFile,
        removeImage,
        setError,
        startAnalysis,
    } = useImageUpload();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        processFile(event.target.files?.[0]);
        event.target.value = "";
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        if (event.dataTransfer.files.length > 1) {
            setError("Будь ласка, завантажуйте лише одне зображення.");
            return;
        }

        processFile(event.dataTransfer.files[0]);
    };

    return (
        <section className="upload-section">
            {!image ? (
                <DropZone
                    inputRef={inputRef}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    onDrop={handleDrop}
                    onChange={handleInputChange}
                />
            ) : (
                <ImagePreview
                    image={image}
                    inputRef={inputRef}
                    onRemove={removeImage}
                    onChange={handleInputChange}
                    onStartAnalysis={startAnalysis}
                />
            )}

            {error && (
                <div className="upload-error" role="alert">
                    <span>!</span>
                    {error}
                </div>
            )}

            {!image && (
                <div className="upload-note">
                    <div className="upload-note-icon">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 11v5" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <p>
                        Після завантаження зображення можна буде переглянути його характеристики та розпочати процес аналізу.
                    </p>
                </div>
            )}
        </section>
    );
}