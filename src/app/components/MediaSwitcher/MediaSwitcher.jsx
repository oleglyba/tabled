import React from "react";
import ImageWithFallback from "@/app/components/ImageWithFallback/ImageWithFallback";

// Функція для перевірки, чи URL вказує на відео
const isVideo = (url) => {
    if (!url || typeof url !== "string") return false;
    const videoExtensions = [".mp4", ".mov", ".webm"];
    return videoExtensions.some((ext) => url.endsWith(ext));
};

const MediaSwitcher = ({
                           mediaUrl,
                           alt,
                           videoClassName,
                           imageClassName,
                           ...props
                       }) => {
    if (isVideo(mediaUrl)) {
        return (
            <video
                className={videoClassName}
                autoPlay
                loop
                muted
                playsInline
                {...props}
            >
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    } else {
        return (
            <ImageWithFallback
                className={imageClassName}
                src={mediaUrl}
                alt={alt}
                {...props}
            />
        );
    }
};

export default MediaSwitcher;
