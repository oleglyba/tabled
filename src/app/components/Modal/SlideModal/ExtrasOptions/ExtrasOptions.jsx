"use client";

import React from "react";
import styles from "../SlideModal.module.scss";

const ExtrasOptions = ({ addons = [], selectedExtras, handleExtrasChange }) => (
    <div className={styles.extrasSection}>
        <h3>Extras (up to 5 options)</h3>
        <ul className={styles.options}>
            {addons.map((addon) => (
                <li key={addon.id} className={styles.option}>
                    <label className={styles.optionLabel}>
                        <div className={styles.leftSide}>
                            <input
                                type="checkbox"
                                value={addon.title}
                                data-price={addon.price}
                                onChange={handleExtrasChange}
                                disabled={
                                    selectedExtras.length >= 5 &&
                                    !selectedExtras.some((extra) => extra.name === addon.title)
                                }
                                checked={selectedExtras.some(
                                    (extra) => extra.name === addon.title
                                )}
                            />
                            <span className={styles.labelText}>{addon.title}</span>
                        </div>
                        <span className={styles.price}>
                            +€{parseFloat(addon.price).toFixed(2)}
                        </span>
                    </label>
                </li>
            ))}
        </ul>
    </div>
);

export default React.memo(ExtrasOptions);
