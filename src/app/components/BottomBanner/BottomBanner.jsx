"use client";

import React from "react";
import styles from "./BottomBanner.module.scss"; // Ваші стилі для банера

const BottomBanner = ({ selectedCount, onClick }) => {
    if (selectedCount <= 0) return null;

    return (
        <div className={styles.bottomBannerContainer} onClick={onClick}>
            <div className={styles.bottomBanner}>
                <p>
                    {selectedCount} item{selectedCount > 1 ? "s" : ""} chosen
                </p>
            </div>
        </div>
    );
};

export default BottomBanner;
