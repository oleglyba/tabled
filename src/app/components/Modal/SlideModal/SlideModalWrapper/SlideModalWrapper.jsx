"use client";

import React, { useState, useCallback, useEffect } from "react";
import styles from "../SlideModal.module.scss";

// Отримує координату Y для миші або сенсорного пристрою
const getClientY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

const SlideModalWrapper = ({ open, onClose, children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [closing, setClosing] = useState(false);

    const handleDragStart = useCallback((e) => {
        setIsDragging(true);
        setStartY(getClientY(e));
    }, []);

    const handleDragMove = useCallback(
        (e) => {
            if (!isDragging) return;
            const currentY = getClientY(e);
            const dragDistance = currentY - startY;
            if (dragDistance > 0) {
                setTranslateY(dragDistance);
            }
        },
        [isDragging, startY]
    );

    const handleDragEnd = useCallback(() => {
        if (translateY > 100) {
            setClosing(true);
            setTimeout(() => {
                onClose();
                setTranslateY(0);
                setClosing(false);
            }, 300);
        } else {
            setTranslateY(0);
        }
        setIsDragging(false);
    }, [translateY, onClose]);

    // Додаємо ефект для плавного зникнення при закритті
    useEffect(() => {
        if (!open) {
            setClosing(true);
            setTimeout(() => setClosing(false), 300); // Час анімації
        }
    }, [open]);

    if (!open && !closing) return null;

    return (
        <div
            className={styles.overlay}
            onMouseMove={handleDragMove}
            onTouchMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
        >
            <div
                className={`${styles.slideModal} ${closing ? styles.closing : styles.open}`}
                style={{
                    transform: closing ? "translateY(100%)" : `translateY(${translateY}px)`,
                    transition: closing ? "transform 0.3s ease-out" : "none",
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                {children}
            </div>
        </div>
    );
};

export default SlideModalWrapper;
