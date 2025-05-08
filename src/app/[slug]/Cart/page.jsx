"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { Trash2 } from "lucide-react";

import styles from "./Cart.module.scss";
import { clearCart, addToCart } from "@/redux/slices/cartSlice";
import {
    clearSelection,
    toggleSelection as toggleSelectionAction,
} from "@/redux/slices/selectionSlice";

import CartItems from "@/app/components/custom/CartItems/CartItems";
import VideoGrid from "@/app/components/VideoGrid/VideoGrid";
import SlideModal from "@/app/components/Modal/SlideModal/SlideModal";
import useMenuData from "@/app/hook/data/useMenuData";
import { useGoHome } from "@/app/hook/useGoHome";

const Loader = dynamic(
    () => import("../../components/Loader/Loader"),
    { ssr: false }
);

function CartPage() {
    const dispatch = useDispatch();
    const goHome = useGoHome();
    const slug = useSelector((state) => state.params.slug);
    const cartItems = useSelector((state) => state.cart[slug] || []);
    const selectedItems = useSelector((state) => state.selection) || [];

    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    const { menuData, loading } = useMenuData();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isReady = isMounted && !loading && !!menuData;

    const handleClearCart = () => {
        dispatch(clearCart({ slug }));
        dispatch(clearSelection());
    };

    const openSlideModal = (product) => {
        setSelectedProduct(product);
        setOpenModal(true);
    };
    const closeSlideModal = () => setOpenModal(false);

    const handleToggleSelection = (id) => {
        dispatch(toggleSelectionAction(id));
    };

    const handleAddToCart = (productWithOptions) => {
        dispatch(
            addToCart({
                ...productWithOptions,
                quantity: productWithOptions.quantity || 1,
                slug,
            })
        );
        closeSlideModal();
    };

    const totalPrice = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        const base = price * qty;
        const itemTotal =
            item.totalPrice != null ? parseFloat(item.totalPrice) || base : base;
        return sum + itemTotal;
    }, 0);

    const allMenuItems = useMemo(
        () =>
            menuData?.menu_categories
                ?.flatMap((cat) => cat.menu_items || [])
                .filter(Boolean) || [],
        [menuData]
    );

    const recommendedItems = useMemo(
        () =>
            allMenuItems.filter(
                (mi) => !cartItems.some((ci) => ci.id === mi.id)
            ),
        [allMenuItems, cartItems]
    );

    const recommendedCategory = {
        id: "recommended",
        name: "People also added",
        slug: "recommended",
        index: 0,
    };

    if (!isReady) {
        return <Loader processing={true} />;
    }

    return (
        <div className={styles.cartPage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={goHome}>
                    <img src="/icon/arrow.svg" alt="Back" />
                </button>
                <h2 className={styles.headerTitle}>Chosen Items</h2>
                <button className={styles.trashButton} onClick={handleClearCart}>
                    <Trash2 size={20} color="#E82C49" />
                </button>
            </header>

            <hr className={styles.divider} />

            <div className={styles.cartItems}>
                {cartItems.length > 0 ? (
                    <CartItems />
                ) : (
                    <p className={styles.emptyCartMessage}>
                        You have no items in your cart yet
                    </p>
                )}
            </div>

            <button className={styles.addMoreButton} onClick={goHome}>
                + Add More
            </button>

            {recommendedItems.length > 0 && (
                <div className={styles.peopleAlsoAddedSection}>
                    <h3>People also added</h3>
                    <VideoGrid
                        videos={recommendedItems}
                        searchQuery=""
                        category={recommendedCategory}
                        onVideoClick={() => {}}
                        translations={{}}
                        selectedItems={selectedItems}
                        toggleSelection={handleToggleSelection}
                        handleAddToCart={handleAddToCart}
                        filters={{ attributes: [] }}
                        onOpenModal={openSlideModal}
                    />
                </div>
            )}

            <div className={styles.cartFooter}>
                <div className={styles.totalInfo}>
                    <div className={styles.totalLabel}>Total:</div>
                    <div className={styles.totalValue}>
                        ${totalPrice.toFixed(2)}
                    </div>
                </div>
                <button className={styles.orderButton}>
                    <span className={styles.orderText}>Order</span>
                </button>
            </div>

            <SlideModal
                open={openModal}
                onClose={closeSlideModal}
                video={selectedProduct}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}

export default CartPage;
