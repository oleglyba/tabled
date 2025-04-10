"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/redux/slices/languageSlice";
import Flag from "react-world-flags";
import styles from "./LanguageModal.module.scss";
import CloseButton from "@/app/components/Button/CloseButton/CloseButton";
import SlideModalWrapper from "@/app/components/Modal/SlideModal/SlideModalWrapper/SlideModalWrapper";
import useDisableBodyScroll from "@/app/hook/useDisableBodyScroll";

const LanguageModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const selectedLanguage = useSelector((state) => state.language);

    // Використовуємо хук для блокування прокрутки сторінки
    useDisableBodyScroll(isOpen);

    if (!isOpen) return null;

    return (
        <SlideModalWrapper open={isOpen} onClose={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dragHandle}></div>
                <div className={styles.modalHeader}>
                    <h3>Languages</h3>
                    <CloseButton onClick={onClose} />
                </div>
                <ul className={styles.languageList}>
                    {[
                        { code: "EN", name: "English", flag: "GB" },
                        { code: "PL", name: "Polish", flag: "PL" },
                        { code: "UA", name: "Ukrainian", flag: "UA" },
                        { code: "DE", name: "German", flag: "DE" },
                        { code: "FR", name: "French", flag: "FR" },
                        { code: "ES", name: "Spanish", flag: "ES" },
                        { code: "IT", name: "Italian", flag: "IT" },
                    ].map((lang) => (
                        <li
                            key={lang.code}
                            className={`${styles.languageItem} ${
                                selectedLanguage === lang.code ? styles.activeLanguage : ""
                            }`}
                            onClick={() => {
                                dispatch(setLanguage(lang.code));
                                onClose();
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Flag code={lang.flag} className={styles.flagIcon} />
                                {lang.name}
                            </div>
                            {selectedLanguage === lang.code && (
                                <span className={styles.checkmark}>✓</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </SlideModalWrapper>
    );
};

export default LanguageModal;
