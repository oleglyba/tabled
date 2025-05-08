"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Search, X } from "lucide-react";
import LanguageModal from "../components/Modal/LanguageModal/LanguageModal";
import useTranslations from "../hook/useTranslation";
import VideoGrid from "../components/VideoGrid/VideoGrid";
import SectionSelect from "../components/SectionSelect/SectionSelect";
import { beveragesList } from "@/app/hook/data/beverages";
import useCategoryObserver from "@/app/hook/useCategoryObserver";
import BeveragesSection from "@/app/components/Beverages/BeveragesSection";
import BottomBanner from "@/app/components/BottomBanner/BottomBanner";
import { setLanguage } from "@/redux/slices/languageSlice";
import { toggleSelection } from "@/redux/slices/selectionSlice";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import styles from "./page.module.scss";
import useCartNavigation from "@/app/hook/useCartNavigation";
import SlideModal from "@/app/components/Modal/SlideModal/SlideModal";
import dynamic from 'next/dynamic';

import useMenuData from "@/app/hook/data/useMenuData";



const Restaurant = () => {
    const { menuData, loading } = useMenuData(); // Отримуємо дані меню
    const params = useSelector((state) => state.params); // отримуємо params із Redux

    const [mounted, setMounted] = useState(false);
    const Loader = dynamic(() => import('../components/Loader/Loader'), { ssr: false });

    useEffect(() => {
        setMounted(true);
    }, []);

    const restaurant = useMemo(() => {
        if (!menuData) return null;

        const safeSlug = params?.slug || menuData?.slug;

        return {
            name: menuData.name,
            slug: safeSlug,
            logo_url: "/assets/sensaNome.svg",
            client: { color: "#ffffff" },
        };
    }, [menuData, params?.slug]);


    const router = useRouter();
    const dispatch = useDispatch();

    const selectedItems = useSelector((state) => state.selection) || [];
    const selectedLanguage = useSelector((state) => state.language);
    const filters = useSelector((state) => state.filters);
    const translations = useTranslations(selectedLanguage);
    const slug = useSelector((state) => state.params.slug);
    const cartItems = useSelector((state) => state.cart[slug] || []);
    const handleToggleSelection = useCallback(
        (id) => {
            dispatch(toggleSelection(id));
        },
        [dispatch]
    );
    const goToAbout = () => {
        router.push('/about');
    };

    // Функція базового додавання (для напоїв)
    const handleAddToCartBasic = useCallback(
        (item) => {
            if (!restaurant?.slug) return; // ⛔ без slug нічого не робимо

            const product = {
                ...item,
                basePrice: Number(item.price) || 0,
                doughPrice: 0,
                extrasPrice: 0,
                quantity: 1,
                slug: restaurant.slug
            };
            dispatch(addToCart(product));
        },
        [dispatch, restaurant] // ⚠️ видали `.slug`, щоб avoid dependency error
    );



    const beveragesRef = useRef(null);
    const categoryRefs = useRef({});

    const [scrollingManually, setScrollingManually] = useState(false);
    const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
    const [isSearchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Стан для модального вікна
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Функція відкриття модального вікна
    const openSlideModal = useCallback((video) => {
        setSelectedVideo(video);
        setModalOpen(true);
    }, []);

    // Обробка категорій. Додаємо логування перед toLowerCase()
    const categories = useMemo(() => {
        const cats = menuData?.menu_categories?.map((cat, index) => {
            const catName = cat.category || "";
            console.log(`Category ${index}:`, catName);
            return {
                id: cat.id,
                name: catName,
                slug: catName.toLowerCase().replace(/\s+/g, "-"),
                index,
                menu_items: cat.menu_items,
            };
        }) || [];
        console.log("Processed categories:", cats);
        return cats;
    }, [menuData]);

    const [activeCategory, setActiveCategory] = useState(categories[0]?.slug);
    const videoCategories = categories.filter((cat) => cat.slug !== "beverages");

    // Обробка фільтрованих категорій. Додаємо логування для fc.name і cat.name
    const activeFilterCategories = filters.categories.filter((cat) => cat.isChecked);
    console.log("Active filter categories:", activeFilterCategories);

    const videoCategoriesToShow =
        activeFilterCategories.length > 0
            ? videoCategories.filter((cat) => {
                const catNameLower = (cat.name || "").toLowerCase();
                const filterNames = activeFilterCategories.map((fc) => {
                    const fcNameLower = (fc.name || "").toLowerCase();
                    console.log("Filter category:", fc.name, "=>", fcNameLower);
                    return fcNameLower;
                });
                console.log("Comparing category:", cat.name, "=>", catNameLower, "with filters:", filterNames);
                return filterNames.includes(catNameLower);
            })
            : videoCategories;

    const handleScrollToCategory = useCallback((slug) => {
        setScrollingManually(true);
        setActiveCategory(slug);
        if (slug === "beverages") {
            if (beveragesRef.current) {
                beveragesRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
                setTimeout(() => setScrollingManually(false), 800);
            }
        } else if (categoryRefs.current[slug]) {
            categoryRefs.current[slug].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            setTimeout(() => setScrollingManually(false), 800);
        }
    }, []);

    const handleVideoClick = useCallback(
        (id) => {
            if (!restaurant) return;
            router.push(`/${restaurant.slug}/videoPlayer/${id}`);
        },
        [router, restaurant]
    );

    useCategoryObserver({
        categoryRefs,
        videoCategories:videoCategoriesToShow,
        scrollingManually,
        setActiveCategory,
    });

    const { goToCart } = useCartNavigation();

    const toggleSearch = () => {
        setSearchActive(!isSearchActive);
        setSearchQuery("");
    };

    const handleAddBeverage = (beverage) => {
        dispatch(toggleSelection(beverage.id));
        const isSelected = selectedItems.includes(beverage.id);
        if (isSelected) {
            dispatch(removeFromCart({ id: beverage.id, slug: restaurant.slug })); // ✅
        } else {
            dispatch(addToCart({ ...beverage, quantity: 1, slug: restaurant.slug })); // ✅
        }
    };


    // Обрахунок відео з фільтрацією. Додаємо логування для video.name
    // Обрахунок відео з фільтрацією. Додаємо логування для video.title
    const totalFilteredVideoCount = useMemo(() => {
        return videoCategoriesToShow.reduce((acc, category) => {
            const items = category.menu_items || [];
            let filteredVideos = items.filter((video) => {
                if (!video) {
                    console.warn("Encountered undefined video in category", category.name);
                    return false;
                }
                const videoTitle = video.title || "";
                console.log("Video title:", video.title, "=>", videoTitle);
                const t = translations || {};
                const translatedTitle = (t[videoTitle] || videoTitle).toLowerCase();
                return translatedTitle.includes(searchQuery.toLowerCase());
            });

            const activeAttrFilters = filters.attributes.filter((attr) => attr.isChecked);
            if (activeAttrFilters.length > 0) {
                activeAttrFilters.forEach((attr) => {
                    const key = (attr.name || "").toLowerCase();
                    filteredVideos = filteredVideos.filter((video) => {
                        if (!video) return false;
                        console.log("Filtering video with key:", key, "video:", video);
                        return !!video[key];
                    });
                });
            }

            return acc + filteredVideos.length;
        }, 0);
    }, [videoCategoriesToShow, searchQuery, translations, filters.attributes]);

    const filteredBeverageCount = useMemo(() => {
        return beveragesList.filter((beverage) =>
            (beverage.name || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
    }, [searchQuery]);

    const totalFiltered = totalFilteredVideoCount + filteredBeverageCount;
    const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const hasBottomBanner = totalCartQuantity > 0;


    if (!mounted || loading || !menuData) {
        return <Loader processing={true} />;
    }

    return (
        <div className={`${styles.pageWrapper} ${hasBottomBanner ? styles.withBottomBanner : ''}`}>

            {isSearchActive ? (
                <div className={styles.searchBar}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder={translations.searchPlaceholder || "Type to search"}
                            value={searchQuery}
                            onChange={(e) => {
                                console.log("Search query:", e.target.value);
                                setSearchQuery(e.target.value);
                            }}
                        />
                        {searchQuery && (
                            <button className={styles.clearButton} onClick={() => setSearchQuery("")}>
                                <Trash2 size={20} color="#737373"/>
                            </button>
                        )}
                    </div>
                    <button className={styles.closeButton} onClick={toggleSearch}>
                        <X size={20} color="#171717"/>
                    </button>
                </div>
            ) : (
                <div className={styles.topBar}>
                    <div className={styles.logoSection}>
                        <img
                            className={styles.logo}
                            src={restaurant.logo_url}
                            alt={restaurant.name}
                            onClick={goToAbout}
                            style={{cursor: 'pointer'}}
                        />
                        <div className={styles.textInfo}>
                            <div
                                className={styles.restaurantName}
                                onClick={goToAbout}
                                style={{cursor: 'pointer'}}
                            >
                                {restaurant.name}
                            </div>
                        </div>
                    </div>


                    <div className={styles.controls}>
                        <button className={styles.languageButton} onClick={() => setLanguageModalOpen(true)}>
                            <span className={styles.languageText}>{selectedLanguage}</span>
                            <span className={styles.arrowDown}></span>
                        </button>
                        <button className={styles.searchButton} onClick={toggleSearch}>
                            <Search size={20} color="#171717"/>
                        </button>
                    </div>
                </div>
            )}

            <LanguageModal
                isOpen={isLanguageModalOpen}
                onClose={() => setLanguageModalOpen(false)}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={(code) => dispatch(setLanguage(code))}
            />

            {!isSearchActive && (
                <SectionSelect
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategorySelect={handleScrollToCategory}
                    filters={filters}
                />
            )}

            {searchQuery && totalFiltered === 0 ? (
                <div className={styles.noResults}>
                    <img src="/icon/NoItem.svg" alt="No items found"/>
                    <p>No Item Found</p>
                </div>
            ) : (
                <>
                    <div className={styles.sections}>
                        {videoCategoriesToShow.map((category) => {
                            let filteredVideos = category.menu_items.filter((video) => {
                                // Use a fallback empty string if video.name is undefined
                                const title = video.title || "";
                                const translatedTitle = (translations[title] || title).toLowerCase();
                                return translatedTitle.includes(searchQuery.toLowerCase());

                            });


                            const activeAttrFilters = filters.attributes.filter((attr) => attr.isChecked);
                            if (activeAttrFilters.length > 0) {
                                activeAttrFilters.forEach((attr) => {
                                    const key = (attr.name || "").toLowerCase();
                                    if (key === "allergen") {
                                        filteredVideos = filteredVideos.filter(
                                            (video) =>
                                                Array.isArray(video.allergens) && video.allergens.length > 0
                                        );
                                    } else {
                                        filteredVideos = filteredVideos.filter((video) => video[key]);
                                    }
                                });
                            }


                            return (
                                <div
                                    key={category.id}
                                    ref={(el) => (categoryRefs.current[category.slug] = el)}
                                    className={styles.categorySection}
                                >
                                    {filteredVideos.length > 0 &&
                                        <h2 className={styles.categoryTitle}>{category.name}</h2>}
                                    <VideoGrid
                                        videos={filteredVideos}
                                        searchQuery={searchQuery}
                                        category={category}
                                        onVideoClick={handleVideoClick}
                                        translations={translations}
                                        selectedItems={selectedItems}
                                        toggleSelection={handleToggleSelection}
                                        handleAddToCart={handleAddToCartBasic}
                                        filters={filters}
                                        onOpenModal={openSlideModal}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.contentDivider}/>

                    <div ref={beveragesRef}>
                        <BeveragesSection
                            beverages={beveragesList}
                            selectedItems={selectedItems}
                            searchQuery={searchQuery}
                            translations={translations}
                            onAddBeverage={handleAddBeverage}
                        />
                    </div>
                </>
            )}

            <BottomBanner selectedCount={totalCartQuantity} onClick={goToCart}/>

            {modalOpen && selectedVideo && (
                <SlideModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    video={selectedVideo}
                    onAddToCart={(videoData) => {
                        dispatch(addToCart({ ...videoData, slug: restaurant.slug }));
                        setModalOpen(false);
                    }}
                />

            )}
        </div>
    );
};

export default Restaurant;
