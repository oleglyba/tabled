"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSelection } from "@/redux/slices/selectionSlice";
import styles from "./SlideModal.module.scss";
import DoughOptions from "@/app/components/Modal/SlideModal/DoughOptions/DoughOptions";
import ExtrasOptions from "@/app/components/Modal/SlideModal/ExtrasOptions/ExtrasOptions";
import CloseButton from "@/app/components/Button/CloseButton/CloseButton";
import SlideModalWrapper from "@/app/components/Modal/SlideModal/SlideModalWrapper/SlideModalWrapper";
import QuantityControl from "@/app/components/Button/QuantityControl/QuantityControl";
import VideoIndicators from "@/app/components/custom/VideoIndicators/VideoIndicators";
import useDisableBodyScroll from "@/app/hook/useDisableBodyScroll";

const SlideModal = ({ open, onClose, video, onAddToCart }) => {
    const dispatch = useDispatch();

    // Забороняємо скрол сторінки, якщо модальне вікно активне
    useDisableBodyScroll(open);

    // Отримуємо список вибраних елементів із selectionSlice
    const selectedItems = useSelector((state) => state.selection);
    const isSelected = video ? selectedItems.includes(video.id) : false;

    const [quantity, setQuantity] = useState(1);
    const [selectedDough, setSelectedDough] = useState("");
    const [selectedDoughPrice, setSelectedDoughPrice] = useState(0);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [showDescription, setShowDescription] = useState(false);

    // Функція скидання стану модального вікна
    const resetModal = useCallback(() => {
        setQuantity(1);
        setSelectedDough("");
        setSelectedDoughPrice(0);
        setSelectedExtras([]);
        setShowDescription(false);
    }, []);

    useEffect(() => {
        if (!open) {
            resetModal();
        }
    }, [open, resetModal]);

    // Обчислення базової ціни та суми екстра-опцій
    const basePrice = useMemo(() => parseFloat(video?.price || 0), [video]);
    const extrasPrice = useMemo(
        () => selectedExtras.reduce((acc, extra) => acc + parseFloat(extra.price), 0),
        [selectedExtras]
    );
    // Загальна ціна з урахуванням кількості та опцій
    const totalPrice = useMemo(
        () => ((basePrice + selectedDoughPrice + extrasPrice) * quantity).toFixed(2),
        [basePrice, selectedDoughPrice, extrasPrice, quantity]
    );

    // Обробники зміни кількості
    const incrementQuantity = useCallback(() => setQuantity((prev) => prev + 1), []);
    const decrementQuantity = useCallback(
        () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)),
        []
    );

    // Обробник вибору типу тіста
    const handleDoughChange = useCallback((e) => {
        const { value, dataset } = e.target;
        setSelectedDough(value);
        setSelectedDoughPrice(parseFloat(dataset.price));
    }, []);

    // Обробник вибору екстра-опцій
    const handleExtrasChange = useCallback((e) => {
        const { value, dataset, checked } = e.target;
        if (checked) {
            setSelectedExtras((prev) => [
                ...prev,
                { name: value, price: parseFloat(dataset.price) },
            ]);
        } else {
            setSelectedExtras((prev) =>
                prev.filter((extra) => extra.name !== value)
            );
        }
    }, []);

    // Додавання товару до кошика – формуємо об’єкт з усіма кастомним даними
    const handleAddToCart = useCallback(() => {
        // Якщо є варіанти тіста, переконуємося, що щось обрано
        if (video.variants?.length > 0 && !selectedDough) return;
        onAddToCart({
            ...video,
            basePrice: basePrice,
            dough: selectedDough,
            doughPrice: selectedDoughPrice,
            extras: selectedExtras,
            extrasPrice: extrasPrice,
            quantity: quantity,
            totalPrice: totalPrice,
        });
        // Позначаємо товар як вибраний (для відображення галочки)
        dispatch(toggleSelection(video.id));
        resetModal();
    }, [
        selectedDough,
        video,
        quantity,
        selectedExtras,
        selectedDoughPrice,
        extrasPrice,
        totalPrice,
        onAddToCart,
        resetModal,
        dispatch,
        basePrice,
    ]);

    const toggleDescription = useCallback(() => setShowDescription((prev) => !prev), []);

    if (typeof open !== "boolean" || !open) return null;

    return (
        <SlideModalWrapper open={open} onClose={onClose}>
            <div className={styles.sliderHandle} />
            <div className={styles.modalContent}>
                {/* Header */}
                <div className={styles.headerRow}>
                    <span className={styles.orderDetails}>Order Details</span>
                    <CloseButton onClick={onClose} />
                </div>
                <hr className={styles.divider} />
                {/* Інформація про відео/товар */}
                {/* Інформація про відео/товар */}
                <div className={styles.videoInfo}>
                    {(video.new ||
                        video.vegetarian ||
                        video.weight ||
                        (video.allergens && video.allergens.length > 0)) && (
                        <div className={styles.indicatorsWrapper}>
                            <VideoIndicators
                                video={{ ...video, allergen: video.allergens && video.allergens.length > 0 }}
                            />
                        </div>
                    )}
                    <div className={styles.priceRow}>
                        <p className={styles.videoPrice}>€{video.price.toFixed(2)}</p>
                        <span className={styles.chevronIcon} onClick={toggleDescription}>
                        {showDescription ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                     </span>
                    </div>
                    <h2 className={styles.modalTitle}>{video.name}</h2>
                </div>

                {/* Опис */}
                <div className={styles.descriptionWrapper}>
                    <p className={`${styles.description} ${showDescription ? styles.expanded : ""}`}>
                        {video.description}
                    </p>
                </div>
                <hr className={styles.divider} />
                {/* Вибір тіста – рендеримо лише якщо є варіанти */}
                {video.variants && video.variants.length > 0 && (
                    <>
                        <DoughOptions
                            variants={video.variants}
                            selectedDough={selectedDough}
                            handleDoughChange={handleDoughChange}
                        />
                        <hr className={styles.divider} />
                    </>
                )}
                {/* Вибір екстра-опцій – рендеримо лише якщо є addons */}
                {video.addons && video.addons.length > 0 && (
                    <>
                        <ExtrasOptions
                            addons={video.addons}
                            selectedExtras={selectedExtras}
                            handleExtrasChange={handleExtrasChange}
                        />
                        <hr className={styles.divider} />
                    </>
                )}
                {/* Контроль кількості та кнопка додавання до кошика */}
                <div className={styles.bottomRow}>
                    <QuantityControl
                        quantity={quantity}
                        decrementQuantity={decrementQuantity}
                        incrementQuantity={incrementQuantity}
                    />
                    {isSelected ? (
                        <div className={styles.addedIndicator}>
                            <img src="/icon/check.svg" alt="Added" className={styles.icon} />
                        </div>
                    ) : (
                        <button
                            className={styles.addToCartButton}
                            onClick={handleAddToCart}
                            disabled={video.variants?.length > 0 ? !selectedDough : false}
                            style={{
                                backgroundColor:
                                    video.variants?.length > 0
                                        ? selectedDough
                                            ? "#41BD73"
                                            : "#B3E4C7"
                                        : "#41BD73",
                                cursor:
                                    video.variants?.length > 0
                                        ? selectedDough
                                            ? "pointer"
                                            : "not-allowed"
                                        : "pointer",
                            }}
                        >
                            Add €{totalPrice}
                        </button>
                    )}
                </div>
            </div>
        </SlideModalWrapper>
    );
};

export default SlideModal;
