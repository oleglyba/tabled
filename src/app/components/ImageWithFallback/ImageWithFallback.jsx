"use client";

import React, { useState } from "react";
import styles from "./ImageWithFallback.module.scss";

const ImageWithFallback = ({ src, alt, className = "", ...props }) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div {...props} className={`${styles.fallbackContainer} ${className}`}>
                <span className={styles.fallbackText}>Tabled</span>
            </div>
        );
    }

    return (
        <img
            {...props}
            className={className}
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
        />
    );
};

export default ImageWithFallback;
