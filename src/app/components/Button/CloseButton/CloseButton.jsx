"use client";

import React from "react";
import { X } from "lucide-react";
import styles from "./CloseButton.module.scss"; // імпортуємо окремий файл стилів

const CloseButton = ({ onClick, size = 24 }) => {
    return (
        <button className={styles.closeButton} onClick={onClick}>
            <X size={size} />
        </button>
    );
};

export default React.memo(CloseButton);
