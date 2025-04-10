"use client";

import React from "react";
import styles from "./AddToCartButton.module.scss";

const AddToCartButton = ({
                             item,
                             isSelected,
                             onOpenModal,
                             toggleSelection,
                             handleAddToCart,
                         }) => {
    console.log("[AddToCartButton] Рендеринг для item:", item, "isSelected:", isSelected);

    const handleClick = (e) => {
        e.stopPropagation();
        console.log("[AddToCartButton] Клік, item:", item);
        if (onOpenModal) {
            console.log("[AddToCartButton] Викликаємо onOpenModal для item:", item);
            onOpenModal(item);
        } else {
            console.log("[AddToCartButton] Викликаємо toggleSelection та handleAddToCart для item:", item);
            toggleSelection(item.id);
            handleAddToCart(item);
        }
    };

    return (
        <div
            className={`${styles.plusContainer} ${isSelected ? styles.selected : ""}`}
            onClick={handleClick}
        >
            {isSelected ? (
                <img src="/icon/check.svg" alt="Check" className={styles.icon} />
            ) : (
                <img src="/icon/plus.svg" alt="Plus" className={styles.icon} />
            )}
        </div>
    );
};

export default AddToCartButton;
