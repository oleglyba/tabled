import React from "react";
import Image from "next/image";
import styles from "./MenuCard.module.scss";

const MenuCard = ({ withImage = false, title = "Tabled" }) => {
    return (
        <div className={`${styles.menuCard} ${withImage ? styles.withImage : ""}`}>
            {!withImage && <div className={styles.logo}>{title}</div>}

            {withImage && (
                <>
                    <div className={styles.tags}>
                        <div className={styles.tag}>
                            <img
                                src="/icon/clock.png"
                                alt="Time"
                                width={12}
                                height={12}
                                className={styles.icon}
                            />
                            <span className={styles.tagText}>10:00 – 12:00</span>
                        </div>
                        <div className={styles.tag}>
                            <Image
                                src="/icon/new.png"
                                alt="New"
                                width={16}
                                height={16}
                                className={styles.icon}
                            />
                            <span className={styles.tagText}>New</span>
                        </div>
                    </div>

                    <div className={styles.menuName}>{title}</div>
                </>
            )}
        </div>
    );
};

export default MenuCard;
