"use client";

import React from "react";
import styles from "../SlideModal.module.scss";

const DoughOptions = ({ variants = [], selectedDough, handleDoughChange }) => (
    <div className={styles.doughSection}>
        <h3>
            Dough <span style={{ color: "red" }}>*</span>
        </h3>
        <ul className={styles.options}>
            {variants.map((variant) => (
                <li key={variant.id} className={styles.option}>
                    <label className={styles.optionLabel}>
                        <div className={styles.leftSide}>
                            <input
                                type="radio"
                                name="dough"
                                value={variant.title}
                                data-price={variant.price}
                                onChange={handleDoughChange}
                                checked={selectedDough === variant.title}
                            />
                            <span className={styles.labelText}>{variant.title}</span>
                        </div>
                        <span className={styles.price}>
                            +€{parseFloat(variant.price).toFixed(2)}
                        </span>
                    </label>
                </li>
            ))}
        </ul>
    </div>
);

export default React.memo(DoughOptions);
