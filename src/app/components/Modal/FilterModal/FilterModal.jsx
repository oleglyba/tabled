"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./FilterModal.module.scss";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import CloseButton from "@/app/components/Button/CloseButton/CloseButton";
import SlideModalWrapper from "@/app/components/Modal/SlideModal/SlideModalWrapper/SlideModalWrapper";
import useDisableBodyScroll from "@/app/hook/useDisableBodyScroll";

const FilterModal = ({ isOpen, onClose, filters, onApply, dishCategories }) => {
    useDisableBodyScroll(isOpen);
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters({
                ...filters,
                categories: dishCategories
                    ? dishCategories.map((cat) => {
                        const existing = filters.categories?.find((fc) => fc.id === cat.id);
                        return existing ? { ...cat, isChecked: existing.isChecked } : { ...cat, isChecked: false };
                    })
                    : filters.categories,
            });
        }
    }, [isOpen, filters, dishCategories]);




    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [isAttributesOpen, setIsAttributesOpen] = useState(true);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [infoModalContent, setInfoModalContent] = useState("");

    const allCategoriesRef = useRef(null);

    useEffect(() => {
        if (allCategoriesRef.current) {
            const checkedCount = localFilters.categories.filter((c) => c.isChecked).length;
            allCategoriesRef.current.indeterminate =
                checkedCount > 0 && checkedCount < localFilters.categories.length;
        }
    }, [localFilters.categories]);

    const handleInfoClick = (content) => {
        setInfoModalContent(content);
        setIsInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setIsInfoModalOpen(false);
        setInfoModalContent("");
    };

    // Обробка зміни вибору для категорій
    const handleCategoryChange = (id) => {
        if (id === "all") {
            const allChecked = localFilters.categories.every((cat) => cat.isChecked);
            const updatedCategories = localFilters.categories.map((cat) => ({
                ...cat,
                isChecked: !allChecked,
            }));
            setLocalFilters((prev) => ({ ...prev, categories: updatedCategories }));
        } else {
            const updatedCategories = localFilters.categories.map((cat) =>
                cat.id === id ? { ...cat, isChecked: !cat.isChecked } : cat
            );
            setLocalFilters((prev) => ({ ...prev, categories: updatedCategories }));
        }
    };

    // Обробка зміни вибору для атрибутів
    const handleAttributeChange = (id) => {
        const updatedAttributes = localFilters.attributes.map((attr) =>
            attr.id === id ? { ...attr, isChecked: !attr.isChecked } : attr
        );
        setLocalFilters((prev) => ({ ...prev, attributes: updatedAttributes }));
    };

    // Скидання всіх фільтрів
    const handleReset = () => {
        const resetCategories = localFilters.categories.map((cat) => ({
            ...cat,
            isChecked: false,
        }));
        const resetAttributes = localFilters.attributes.map((attr) => ({
            ...attr,
            isChecked: false,
        }));
        const resetFilters = { categories: resetCategories, attributes: resetAttributes };
        setLocalFilters(resetFilters);
        onApply(resetFilters); // передаємо оновлене значення назад
    };


    // Визначаємо, чи всі/жодна категорія або атрибут вибрані
    const isCategoriesNone = localFilters.categories.every((cat) => !cat.isChecked);
    const isAttributesNone = localFilters.attributes.every((attr) => !attr.isChecked);
    const isCategoriesAll = localFilters.categories.every((cat) => cat.isChecked);
    const isAttributesAll = localFilters.attributes.every((attr) => attr.isChecked);

    // Кнопка «Apply» неактивна, якщо обрано або нічого (обидві групи за замовчуванням),
    // або обрано всі (обидві групи - default, тобто не фільтруємо)
    const isApplyDisabled =
        (isCategoriesNone && isAttributesNone) ||
        (isCategoriesAll && isAttributesAll);

    const handleApplyClick = () => {
        if (!isApplyDisabled) {
            onApply(localFilters);
        }
    };

    return (
        <SlideModalWrapper open={isOpen} onClose={onClose}>
            <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dragHandle}></div>
                <div className={styles.filterHeader}>
                    <h3>Filters</h3>
                    <CloseButton onClick={onClose} size={20} />
                </div>
                <div className={styles.modalBody}>
                    {/* Секція "Dish Category" */}
                    {/* Секція "Dish Category" */}
                    <div className={styles.filterSection}>
                        <div
                            className={styles.sectionHeader}
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        >
                            <h4>Dish Category</h4>
                            {isCategoriesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {isCategoriesOpen && (
                            <ul className={styles.filterList}>
                                <li className={styles.filterItem}>
                                    <label className={`${styles.checkboxLabel} ${styles.minusCheckbox}`}>
                                        <input
                                            ref={allCategoriesRef}
                                            type="checkbox"
                                            checked={localFilters.categories.every((category) => category.isChecked)}
                                            onChange={() => handleCategoryChange("all")}
                                        />
                                        <span>All</span>
                                    </label>
                                </li>
                                {localFilters.categories.map((category) => (
                                    <li key={category.id} className={styles.filterItem}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={category.isChecked}
                                                onChange={() => handleCategoryChange(category.id)}
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Секція "Attributes" */}
                    <div className={styles.filterSection}>
                        <div
                            className={styles.sectionHeader}
                            onClick={() => setIsAttributesOpen(!isAttributesOpen)}
                        >
                            <h4>Attributes</h4>
                            {isAttributesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {isAttributesOpen && (
                            <ul className={styles.filterList}>
                                {localFilters.attributes.map((attribute) => (
                                    <li key={attribute.id} className={styles.filterItem}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={attribute.isChecked}
                                                onChange={() => handleAttributeChange(attribute.id)}
                                            />
                                            <span className={styles.attributeName}>{attribute.name}</span>
                                        </label>
                                        {attribute.hasInfo && (
                                            <Info
                                                className={styles.infoIcon}
                                                size={18}
                                                onClick={() =>
                                                    handleInfoClick(
                                                        attribute.infoContent || "No additional information."
                                                    )
                                                }
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.defaultButton} onClick={handleReset}>
                        To Default
                    </button>
                    <button
                        className={`${styles.applyButton} ${isApplyDisabled ? styles.disabled : ""}`}
                        onClick={handleApplyClick}
                        disabled={isApplyDisabled}
                    >
                        Apply
                    </button>
                </div>
                {/* Info Modal */}
                {isInfoModalOpen && (
                    <div className={styles.infoModalOverlay} onClick={closeInfoModal}>
                        <div className={styles.infoModal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.infoModalHeader}>
                                <h4>Details</h4>
                                <CloseButton onClick={closeInfoModal} size={20} />
                            </div>
                            <div className={styles.infoModalBody}>
                                <p>{infoModalContent}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SlideModalWrapper>
    );
};

export default FilterModal;
