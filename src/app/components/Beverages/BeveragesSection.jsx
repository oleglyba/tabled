import React from "react";
import styles from "./BeveragesSection.module.scss";
import MediaSwitcher from "@/app/components/MediaSwitcher/MediaSwitcher";

const BeveragesSection = ({ beverages, selectedItems, searchQuery, translations, onAddBeverage }) => {
    const filteredBeverages = beverages.filter((beverage) =>
        beverage.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredBeverages.length === 0) return null;

    return (
        <div className={styles.beveragesContainer}>
            <h2 className={styles.categoryTitle}>
                {translations.beverages || "Beverages"}
            </h2>
            <div className={styles.beveragesList}>
                {filteredBeverages.map((beverage) => {
                    const isSelected = selectedItems.includes(beverage.id);
                    return (
                        <div key={beverage.id} className={styles.beverageItem}>
                            <div className={styles.beverageContent}>
                                <div className={styles.imageVolumeWrapper}>
                                    <MediaSwitcher
                                        mediaUrl={beverage.image}
                                        alt={beverage.name}
                                        imageClassName={styles.beverageImage}
                                    />
                                    <span className={styles.volume}>{beverage.volume}</span>
                                </div>
                                <span className={styles.name}>{beverage.name}</span>
                                <span className={styles.price}>
                                    €{beverage.price.toFixed(2)}
                                </span>
                            </div>
                            <div
                                className={`${styles.addButton} ${isSelected ? styles.check : styles.plus}`}
                                onClick={() => onAddBeverage(beverage)}
                            >
                                <MediaSwitcher
                                    mediaUrl={isSelected ? "/icon/check.svg" : "/icon/plusBlack.svg"}
                                    alt={isSelected ? "Check" : "Plus"}
                                    imageClassName={styles.addButtonIcon}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BeveragesSection;
