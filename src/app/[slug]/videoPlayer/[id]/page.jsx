"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { addToCart } from "@/redux/slices/cartSlice";
import ImageWithFallback from "@/app/components/ImageWithFallback/ImageWithFallback";
import SlideModal from "@/app/components/Modal/SlideModal/SlideModal";
import BottomBanner from "@/app/components/BottomBanner/BottomBanner";
import styles from "./page.module.scss";
import useCartNavigation from "@/app/hook/useCartNavigation";
import VideoIndicators from "@/app/components/custom/VideoIndicators/VideoIndicators";
import TopBar from "@/app/components/TopBar/TopBar";
import useMenuData from "@/app/hook/data/useMenuData";

// Loader (динамічний імпорт)
import dynamic from "next/dynamic";
import {transformMediaUrl} from "@/utils/transformMediaUrl";
const Loader = dynamic(() => import('@/app/components/Loader/Loader'), { ssr: false });

const isVideo = (url) => {
    if (!url || typeof url !== 'string') return false;
    const videoExtensions = ['.mp4', '.mov', '.webm'];
    return videoExtensions.some((ext) => url.endsWith(ext));
};

const VideoPlayer = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart || []);
    const selectedItems = useSelector((state) => state.selection || []);
    const { id } = useParams();
    const videoId = parseInt(id || '0', 10);

    const { goToCart } = useCartNavigation();
    const { menuData, loading } = useMenuData();

    const allVideos = useMemo(() => {
        return menuData?.menu_categories?.flatMap((cat) => cat.menu_items || []) || [];
    }, [menuData]);

    const [initialIndex, setInitialIndex] = useState(null);
    const [muteStates, setMuteStates] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [expandedVideoId, setExpandedVideoId] = useState(null);

    const videosRef = useRef([]);
    const observerRef = useRef(null);

    const openSlideModal = useCallback((video) => {
        setSelectedVideo(video);
        setOpenModal(true);
    }, []);

    const closeSlideModal = useCallback(() => {
        setOpenModal(false);
    }, []);

    const addToCartHandler = (video) => {
        dispatch(addToCart({ ...video, quantity: video.quantity || 1 }));
        closeSlideModal();
    };

    useEffect(() => {
        if (!allVideos.length) return;

        const index = allVideos.findIndex((v) => v.id === videoId);
        if (index === -1) return;

        setInitialIndex(index);
        videosRef.current = allVideos.map(() => React.createRef());
        setMuteStates(
            allVideos.reduce((acc, video) => ({ ...acc, [video.id]: true }), {})
        );
    }, [videoId, allVideos]);

    useEffect(() => {
        if (!videosRef.current.length) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (typeof entry.target.play === 'function') {
                        entry.isIntersecting ? entry.target.play() : entry.target.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        videosRef.current.forEach((videoRef) => {
            if (videoRef.current) observerRef.current.observe(videoRef.current);
        });

        return () => observerRef.current.disconnect();
    }, [allVideos]);

    if (loading || initialIndex === null) {
        return <Loader processing={true} />;
    }

    const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <div className={styles.wrapper}>
                <Swiper
                    direction="vertical"
                    className={styles.swiper}
                    autoHeight
                    initialSlide={initialIndex}
                    loop
                >
                    {allVideos.map((video, idx) => {
                        const isExpanded = video.id === expandedVideoId;
                        const isSelected = selectedItems.includes(video.id);
                        const mediaUrl = transformMediaUrl(video.main_video || video.image || "");

                        return (
                            <SwiperSlide key={video.id}>
                                <div className={styles.videoCard}>
                                    <div className={styles.videoWrapper}>
                                        <TopBar />

                                        {isVideo(mediaUrl) ? (
                                            <video
                                                ref={videosRef.current[idx]}
                                                src={mediaUrl}
                                                loop
                                                muted={muteStates[video.id]}
                                                autoPlay
                                                className={styles.videoElement}
                                            />
                                        ) : (
                                            <ImageWithFallback
                                                src={mediaUrl}
                                                alt={video.title}
                                                className={styles.videoElement}
                                            />
                                        )}

                                        <div className={`${styles.videoOverlay} ${totalCartQuantity > 0 ? styles.withBanner : ''}`}>
                                            <div className={styles.videoText}>
                                                <VideoIndicators
                                                    video={{
                                                        ...video,
                                                        allergen: video.allergens?.length > 0,
                                                    }}
                                                    styleIndicator={{ background: '#FFFFFF33' }}
                                                    styleText={{ color: '#FFFFFF' }}
                                                />

                                                <p className={styles.videoPrice}>
                                                    €{video.price.toFixed(2)}
                                                </p>
                                                <h3 className={styles.videoTitle}>{video.title}</h3>
                                                <p className={`${styles.videoDescription} ${isExpanded ? styles.expanded : ''}`}>
                                                    {video.description}
                                                </p>
                                            </div>

                                            <div className={styles.actionButtons}>
                                                <button
                                                    className={styles.expandButton}
                                                    onClick={() =>
                                                        setExpandedVideoId(isExpanded ? null : video.id)
                                                    }
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown size={18} />
                                                    ) : (
                                                        <ChevronUp size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    className={`${styles.addToCartButton} ${isSelected ? styles.checked : styles.plus}`}
                                                    onClick={() => openSlideModal(video)}
                                                >
                                                    {isSelected ? (
                                                        <img
                                                            src="/icon/check.svg"
                                                            alt="Added"
                                                            className={styles.icon}
                                                        />
                                                    ) : (
                                                        <img
                                                            src="/icon/plus.svg"
                                                            alt="Add to Cart"
                                                            className={styles.icon}
                                                        />
                                                    )}
                                                </button>
                                            </div>

                                            <BottomBanner
                                                selectedCount={totalCartQuantity}
                                                onClick={goToCart}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            <SlideModal
                open={openModal}
                onClose={closeSlideModal}
                video={selectedVideo}
                onAddToCart={addToCartHandler}
            />
        </>
    );
};

export default VideoPlayer;
