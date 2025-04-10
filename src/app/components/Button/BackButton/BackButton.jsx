"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import styles from "./BackButton.module.scss";

const BackButton = () => {
    const router = useRouter();

    return (
        <button
            className={styles.backButton}
            onClick={() => router.back()}
        >
            <ChevronLeft size={24} color="white" />
        </button>
    );
};

export default BackButton;
