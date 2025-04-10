"use client";

import React, { useMemo } from "react";
import styles from "./VideoGrid.module.scss";
import MediaSwitcher from "@/app/components/MediaSwitcher/MediaSwitcher";
import AddToCartButton from "@/app/components/Button/AddToCartButton/AddToCartButton";

const VideoGrid = ({
                       videos = [],
                       searchQuery = "",
                       onVideoClick,
                       translations,
                       selectedItems,
                       toggleSelection,
                       handleAddToCart,
                       filters,
                       onOpenModal,
                   }) => {
    // Додаємо властивість "allergen" для кожного відео на основі масиву allergens
    const enrichedVideos = useMemo(() => {
        return videos.map((video) => ({
            ...video,
            allergen: Array.isArray(video.allergens) && video.allergens.length > 0,
        }));
    }, [videos]);

    // Фільтрація відео за пошуковим запитом та активними атрибутами
    const filteredVideos = useMemo(() => {
        let result = enrichedVideos.filter((video) => {
            const translatedName = translations?.[video.title] ?? video.title ?? "";
            return translatedName.toLowerCase().includes(searchQuery.toLowerCase());
        });

        const activeAttrFilters = filters.attributes?.filter((attr) => attr.isChecked) || [];
        if (activeAttrFilters.length > 0) {
            activeAttrFilters.forEach((attr) => {
                const key = attr.name.toLowerCase();
                result = result.filter((video) => video[key] === true);
            });
        }

        return result;
    }, [enrichedVideos, searchQuery, filters.attributes, translations]);

    // if (filteredVideos.length === 0) {
    //     return (
    //         <div className={styles.noResults}>
    //             <img src="/icon/NoItem.svg" alt="No items found" />
    //             <p>No Items Found</p>
    //         </div>
    //     );
    // }

    return (
        <div className={styles.videoGrid}>
            {filteredVideos.map((item) => (
                <div
                    key={item.id}
                    className={styles.videoCard}
                    onClick={() => onVideoClick(item.id)}
                >
                    <div className={styles.videoWrapper}>
                        <MediaSwitcher
                            mediaUrl={item.main_video || item.image || ""}
                            alt={item.title}
                            videoClassName={styles.videoPlayer}
                            imageClassName={styles.imagePlayer}
                        />
                        <div className={styles.videoOverlayTop}>
                            {item.new && (
                                <div className={styles.newIndicator}>
                                    <img src="/icon/new.png" alt="new" className={styles.iconIndicator} />
                                    <span className={styles.indicatorText}>new</span>
                                </div>
                            )}
                            {item.vegetarian && (
                                <div className={styles.vegetarianIndicator}>
                                    <img src="/icon/vegetarian.png" alt="Vegetarian" className={styles.iconIndicator} />
                                    <span className={styles.indicatorText}>Vegetarian</span>
                                </div>
                            )}
                            {item.weight && (
                                <div className={styles.weight}>
                                    <img src="/icon/place.png" alt="weight" className={styles.iconIndicator} />
                                    <span className={styles.indicatorText}>{item.weight} г</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.videoOverlayBottom}>
                            <div className={styles.infoLeft}>
                                <p className={styles.videoPrice}>€{item.price}</p>
                                <p className={styles.videoTitle}>
                                    {translations?.[item.title] ?? item.title ?? ""}
                                </p>
                            </div>
                            <AddToCartButton
                                item={item}
                                isSelected={selectedItems.includes(item.id)}
                                onOpenModal={onOpenModal}
                                toggleSelection={toggleSelection}
                                handleAddToCart={handleAddToCart}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoGrid;
