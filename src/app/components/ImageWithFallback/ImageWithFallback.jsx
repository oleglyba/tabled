"use client";

import React, { useState } from "react";
import styles from "./ImageWithFallback.module.scss";
import { transformMediaUrl } from "@/utils/transformMediaUrl";

// Визначаємо, чи медіа є відео
const isVideo = (url) => {
    if (!url || typeof url !== "string") return false;
    const videoExtensions = [".mp4", ".mov", ".webm"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const ImageWithFallback = ({ src, alt = "media", className = "", ...props }) => {
    const [hasError, setHasError] = useState(false);
    const fullUrl = transformMediaUrl(src || "");

    if (!fullUrl || hasError) {
        return (
            <div
                {...props}
                className={`${styles.fallbackContainer} ${styles.imagePlayer} ${className}`}
                role="img"
                aria-label="Media not available"
            >
                <img
                    src="/assets/Tabled.png"
                    alt="Not available"
                    className={styles.fallbackIcon}
                />
            </div>
        );
    }

    if (isVideo(fullUrl)) {
        return (
            <video
                {...props}
                className={`${styles.imagePlayer} ${className}`}
                preload="metadata"
                autoPlay
                loop
                muted
                playsInline
                onError={() => setHasError(true)}
            >
                <source src={fullUrl} type={`video/${fullUrl.split('.').pop()}`} />
                Your browser does not support the video tag.
            </video>
        );
    }

    return (
        <img
            {...props}
            className={`${styles.imagePlayer} ${className}`}
            src={fullUrl}
            alt={alt}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
};

export default ImageWithFallback;
