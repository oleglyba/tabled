"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./About.module.scss";
import TopBar from "@/app/components/TopBar/TopBar";
import useMenuData from "@/app/hook/data/useMenuData";


const AboutPage = () => {
    const copiedFieldRef = useRef(null);
    const [copiedField, setCopiedField] = useState(null);
    const { menuData } = useMenuData();

    const socialLinks = useMemo(() => [
        { href: "https://twitter.com", icon: "/icon/about/X.svg", alt: "Twitter" },
        { href: "https://facebook.com", icon: "/icon/about/Facebook.svg", alt: "Facebook" },
        { href: "https://instagram.com", icon: "/icon/about/Instagram.svg", alt: "Instagram" },
        { href: "https://linkedin.com", icon: "/icon/about/LinkedIn.svg", alt: "LinkedIn" },
    ], []);

    const infoItems = useMemo(() => [
        { icon: "/icon/about/MapPin.svg", text: "19 Rue du Roule 75001 Paris", type: "link" },
        { icon: "/icon/about/Clock.svg", text: "Mon - Sun | 10:00 - 23:00", type: null },
        { icon: "/icon/about/Wifi.svg", text: "12345678", type: "copy" },
        { icon: "/icon/about/Phone.svg", text: "+33 7 66 98 66 29", type: "copy" },
        { icon: "/icon/about/Mail.svg", text: "senzanome@gmail.com", type: "copy" },
    ], []);

    const handleLeaveFeedback = useCallback(() => {
        alert("Feedback form coming soon!");
    }, []);

    const handleCopyText = useCallback((text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                copiedFieldRef.current = text;
                setCopiedField(text);
                setTimeout(() => setCopiedField(null), 2000);
            })
            .catch(err => console.error("Failed to copy text: ", err));
    }, []);

    const handleMapLinkClick = useCallback((text) => {
        if (typeof window !== "undefined") {
            window.open(`https://maps.google.com?q=${encodeURIComponent(text)}`, "_blank");
        }
    }, []);

    return (
        <div className={styles.aboutPage}>
            <TopBar />
            <div className={styles.separator}></div>
            <div className={styles.content}>
                <div className={styles.logoContainer}>
                    <Image
                        src="/assets/sensaNome.svg"
                        alt="Senza Nome Logo"
                        width={100}
                        height={100}
                        className={styles.logo}
                        priority
                    />
                    <h2 className={styles.title}>{menuData?.name || "Tabled "}</h2>
                </div>
                <p className={styles.description}>
                    Le Senza Nome, a Neapolitan pizzeria in Paris, offers you wood-fired
                    pizzas, homemade with quality Italian products.
                </p>
                <div className={styles.infoContainer}>
                    {infoItems.map(({ icon, text, type }) => (
                        <div className={styles.infoItem} key={text}>
                            <Image
                                src={icon}
                                alt={text}
                                width={24}
                                height={24}
                                className={styles.infoIcon}
                                loading="lazy"
                            />
                            <span className={styles.infoText}>{text}</span>
                            {type === "link" ? (
                                <Image
                                    src="/icon/about/ExternalLink.svg"
                                    alt="External Link"
                                    width={20}
                                    height={20}
                                    className={styles.actionIcon}
                                    onClick={() => handleMapLinkClick(text)}
                                />
                            ) : type === "copy" ? (
                                copiedField === text ? (
                                    <span className={styles.copiedText}>Copied</span>
                                ) : (
                                    <Image
                                        src="/icon/about/Copy.svg"
                                        alt="Copy"
                                        width={20}
                                        height={20}
                                        className={styles.actionIcon}
                                        onClick={() => handleCopyText(text)}
                                    />
                                )
                            ) : null}
                        </div>
                    ))}
                </div>

                {/* Follow Us Section */}
                <div className={styles.followUs}>
                    <p className={styles.followUsTitle}>Follow us</p>
                    <div className={styles.socialIcons}>
                        {socialLinks.map(({ href, icon, alt }) => (
                            <a
                                key={alt}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialIcon}
                            >
                                <Image
                                    src={icon}
                                    alt={alt}
                                    width={20}
                                    height={20}
                                    loading="lazy"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.bottomBannerContainer} onClick={handleLeaveFeedback}>
                <div className={styles.bottomBanner}>
                    <p>Leave Feedback</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
