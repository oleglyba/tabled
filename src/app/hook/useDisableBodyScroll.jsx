"use client";

import { useEffect } from "react";

const useDisableBodyScroll = (isActive) => {
    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isActive]);
};

export default useDisableBodyScroll;
