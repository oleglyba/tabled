"use client";

import React from "react";
import styles from "./VideoIndicators.module.scss";

const VideoIndicators = ({ video, styleIndicator, styleText }) => {
    console.log("[VideoIndicators] Відео для індикаторів:", video);

    // Якщо жодного індикатора немає, виводимо повідомлення в консоль і не рендеримо нічого
    if (!video.new && !video.vegetarian && !video.allergen && !video.weight) {
        console.log("[VideoIndicators] Немає індикаторів для цього відео.");
        return null;
    }

    return (
        <div className={styles.indicators}>
            {video.new && (
                <div className={styles.indicator} style={styleIndicator}>
                    <img src="/icon/new.png" alt="New" className={styles.icon} />
                    <span className={styles.text} style={styleText}>New</span>
                </div>
            )}
            {video.vegetarian && (
                <div className={styles.indicator} style={styleIndicator}>
                    <img src="/icon/vegetarian.png" alt="Vegetarian" className={styles.icon} />
                    <span className={styles.text} style={styleText}>Vegetarian</span>
                </div>
            )}
            {video.allergen && (
                <div className={styles.indicator} style={styleIndicator}>
                    <img src="/icon/allergen.png" alt="Allergen" className={styles.icon} />
                    <span className={styles.text} style={styleText}>Allergen</span>
                </div>
            )}
            {video.weight && (
                <div className={styles.indicator} style={styleIndicator}>
                    <img src="/icon/place.png" alt="Weight" className={styles.icon} />
                    <span className={styles.text} style={styleText}>{video.weight} г</span>
                </div>
            )}
        </div>
    );
};

export default VideoIndicators;
