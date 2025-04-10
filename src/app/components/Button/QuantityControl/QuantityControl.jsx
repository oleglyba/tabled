"use client";

import React from "react";
import { Plus } from "lucide-react";
import styles from "./QuantityControl.module.scss"; // Окремий файл стилів для цього компонента

const QuantityControl = ({ quantity, decrementQuantity, incrementQuantity }) => {
    return (
        <div className={styles.quantityControl}>
            <button className={styles.minusButton} onClick={decrementQuantity}>
                –
            </button>
            <span className={styles.quantityText}>{quantity}</span>
            <button className={styles.plusButton} onClick={incrementQuantity}>
                <Plus size={18} />
            </button>
        </div>
    );
};

export default QuantityControl;
