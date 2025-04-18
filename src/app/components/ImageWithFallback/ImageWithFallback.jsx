"use client";

import React, { useState } from "react";
import styles from "./ImageWithFallback.module.scss";
import { transformMediaUrl } from "@/utils/transformMediaUrl";

// Перевірка, чи це відео
const isVideo = (url) => {
    if (!url || typeof url !== "string") return false;
    const videoExtensions = [".mp4", ".mov", ".webm"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const ImageWithFallback = ({ src, alt = "media", className = "", ...props }) => {
    const [hasError, setHasError] = useState(false);
    const fullUrl = transformMediaUrl(src || "");

    // Fallback, якщо помилка або URL порожній
    if (!fullUrl || hasError) {
        return (
            <div
                {...props}
                className={`${styles.fallbackContainer} ${className}`}
                role="img"
                aria-label="Media not available"
            >
                <span className={styles.fallbackText}>Tabled</span>
            </div>
        );
    }

    // Якщо це відео — використовуємо <video> з <source>
    if (isVideo(fullUrl)) {
        return (
            <video
                {...props}
                className={className}
                preload="metadata"
                autoPlay
                loop
                muted
                playsInline
                onError={() => setHasError(true)}
            >
                <source src={fullUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    }

    // Якщо це зображення
    return (
        <img
            {...props}
            className={className}
            src={fullUrl}
            alt={alt}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
};

export default ImageWithFallback;
