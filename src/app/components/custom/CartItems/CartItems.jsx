"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "@/redux/slices/cartSlice";
import { removeSelection } from "@/redux/slices/selectionSlice";
import styles from "./CartItems.module.scss";
import QuantityControl from "@/app/components/Button/QuantityControl/QuantityControl";
import ImageWithFallback from "@/app/components/ImageWithFallback/ImageWithFallback";
import VideoIndicators from "@/app/components/custom/VideoIndicators/VideoIndicators";

export default function CartItems() {
    const dispatch = useDispatch();

    // ✅ Отримуємо slug з Redux
    const slug = useSelector((state) => state.params.slug);

    // ✅ Отримуємо лише товари поточного ресторану
    const cartItems = useSelector((state) => state.cart[slug] || []);

    const processedCartItems = cartItems.map((item) => ({
        ...item,
        allergen: item.allergen || (Array.isArray(item.allergens) && item.allergens.length > 0),
    }));

    return (
        <div className={styles.cartItems}>
            {processedCartItems.length > 0 ? (
                processedCartItems.map((cartItem) => {
                    const price = Number(cartItem.price) || 0;
                    const quantity = Number(cartItem.quantity) || 0;
                    const computedTotal = price * quantity;
                    const totalFromCart = Number(cartItem.totalPrice);
                    const itemPrice = isNaN(totalFromCart) ? computedTotal : totalFromCart;

                    const mediaUrl = cartItem.main_video || cartItem.image || "";

                    // ✅ Піднімаємо кількість і передаємо slug
                    const handleIncrement = () => {
                        dispatch(updateCartQuantity({
                            id: cartItem.id,
                            quantity: quantity + 1,
                            slug
                        }));
                    };

                    // ✅ Зменшуємо або видаляємо — з передачею slug
                    const handleDecrement = () => {
                        const newQuantity = quantity - 1;
                        if (newQuantity > 0) {
                            dispatch(updateCartQuantity({
                                id: cartItem.id,
                                quantity: newQuantity,
                                slug
                            }));
                        } else {
                            dispatch(removeFromCart({ id: cartItem.id, slug }));
                            dispatch(removeSelection(cartItem.id));
                        }
                    };

                    const hasIndicators = cartItem.new || cartItem.vegetarian || cartItem.allergen || cartItem.weight;

                    const cartItemClass = hasIndicators
                        ? styles.cartItem
                        : `${styles.cartItem} ${styles.centerCartItem}`;

                    const descriptionClass = hasIndicators
                        ? styles.descriptionWrapper
                        : `${styles.descriptionWrapper} ${styles.centerDescriptionWrapper}`;

                    return (
                        <div key={cartItem.id} className={cartItemClass}>
                            <div className={styles.mediaWrapper}>
                                <ImageWithFallback
                                    className={styles.imagePlayer}
                                    src={mediaUrl}
                                    alt={cartItem.name || cartItem.title}
                                />
                            </div>

                            <div className={descriptionClass}>
                                {hasIndicators && (
                                    <div className={styles.indicators}>
                                        <VideoIndicators video={cartItem} />
                                    </div>
                                )}
                                <div className={styles.info}>
                                    <div className={styles.name}>{cartItem.title || cartItem.name}</div>
                                    <div className={styles.price}>€ {itemPrice.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className={styles.quantityControl}>
                                <QuantityControl
                                    quantity={quantity}
                                    incrementQuantity={handleIncrement}
                                    decrementQuantity={handleDecrement}
                                />
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className={styles.emptyCart}>Your cart is empty.</p>
            )}
        </div>
    );
}
