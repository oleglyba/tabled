"use client";

import React from "react";
import styles from "./TopBar.module.scss";
import BackButton from "@/app/components/Button/BackButton/BackButton";

const TopBar = () => {
    return (
        <div className={styles.topBar}>
            <div className={styles.controlButtons}>
                <BackButton />
            </div>
            <div className={styles.cartWrapper}>
                <img
                    src="/icon/globe.svg"
                    alt="Globe Icon"
                    className={styles.cartIcon}
                />
            </div>
        </div>
    );
};

export default TopBar;
