// app/hooks/useCategoryObserver.js
import { useEffect, useRef } from "react";

const useCategoryObserver = ({ categoryRefs, videoCategories, scrollingManually, setActiveCategory }) => {
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                if (scrollingManually) return;
                let foundVisibleCategory = false;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const visibleCategory = videoCategories.find(
                            (category) => categoryRefs.current[category.slug] === entry.target
                        );
                        if (visibleCategory) {
                            setActiveCategory(visibleCategory.slug);
                            foundVisibleCategory = true;
                        }
                    }
                });
                if (!foundVisibleCategory && window.scrollY === 0 && videoCategories.length > 0) {
                    setActiveCategory(videoCategories[0].slug);
                }
            },
            {
                rootMargin: "-20% 0px -50% 0px",
                threshold: 0.2,
            }
        );

        videoCategories.forEach((category) => {
            if (categoryRefs.current[category.slug]) {
                observer.current.observe(categoryRefs.current[category.slug]);
            }
        });

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [categoryRefs, videoCategories, scrollingManually, setActiveCategory]);
};

export default useCategoryObserver;
