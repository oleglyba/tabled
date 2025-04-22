import React from "react";
import ImageWithFallback from "@/app/components/ImageWithFallback/ImageWithFallback";

const MediaSwitcher = ({
                           mediaUrl,
                           alt,
                           videoClassName,
                           imageClassName,
                           ...props
                       }) => {
    return (
        <ImageWithFallback
            src={mediaUrl}
            alt={alt}
            className={videoClassName || imageClassName}
            {...props}
        />
    );
};

export default MediaSwitcher;
