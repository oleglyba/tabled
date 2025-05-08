"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";
import styles from "./QuantityControl.module.scss";

const QuantityControl = ({ quantity, decrementQuantity, incrementQuantity }) => {
    return (
        <div className={styles.quantityControl}>
            <button className={styles.minusButton} onClick={decrementQuantity}>
                <Minus  strokeWidth={2} />
            </button>
            <span className={styles.quantityText}>{quantity}</span>
            <button className={styles.plusButton} onClick={incrementQuantity}>
                <Plus  strokeWidth={2} />
            </button>
        </div>
    );
};

export default QuantityControl;
