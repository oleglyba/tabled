"use client";

import {useParams, useRouter} from "next/navigation";

const useCartNavigation = () => {
    const router = useRouter();
    const { slug } = useParams();



    const goToCart = () => {
        router.push(`/${slug}/Cart`);
    };

    return { goToCart };
};

export default useCartNavigation;
