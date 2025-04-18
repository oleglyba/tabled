"use client";

import React, { useState } from "react";
import styles from "./ImageWithFallback.module.scss";
import { transformMediaUrl } from "@/utils/transformMediaUrl";

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
                className={`${styles.fallbackContainer} ${className}`}
                role="img"
                aria-label="Media not available"
            >
                <span className={styles.fallbackText}>Tabled</span>
            </div>
        );
    }

    if (isVideo(fullUrl)) {
        return (
            <video
                {...props}
                className={className}
                src={fullUrl}
                preload="metadata"
                autoPlay
                loop
                muted
                onError={() => setHasError(true)}
            />
        );
    }

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
