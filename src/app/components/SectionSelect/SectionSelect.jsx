"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./SectionSelect.module.scss";
import { Filter } from "lucide-react";
import FilterModal from "@/app/components/Modal/FilterModal/FilterModal";
import { updateFilters } from "@/redux/slices/filtersSlice";

const SectionSelect = ({ categories, activeCategory, onCategorySelect, filters }) => {
    const dispatch = useDispatch();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilterModal = () => {
        setIsFilterOpen((prev) => !prev);
    };

    const handleApply = (updatedFilters) => {
        dispatch(updateFilters(updatedFilters));
        toggleFilterModal();
    };

    return (
        <div className={styles.categoryNav}>
            <div className={styles.categoryList}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryButton} ${
                            activeCategory === category.slug ? styles.activeCategory : ""
                        }`}
                        onClick={() => onCategorySelect(category.slug)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/** Блок, який містить і сепаратор, і кнопку фільтра */}
            <div className={styles.filterContainer}>
                <div className={styles.separator}></div>
                <div className={styles.filterButton} onClick={toggleFilterModal}>
                    <Filter size={20} />
                </div>
            </div>

            <FilterModal
                isOpen={isFilterOpen}
                onClose={toggleFilterModal}
                filters={filters}
                dishCategories={categories}
                onApply={handleApply}
            />
        </div>
    );
};

export default SectionSelect;
