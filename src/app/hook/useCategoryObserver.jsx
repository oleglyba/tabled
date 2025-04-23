import { useEffect, useRef } from "react";

const useCategoryObserver = ({ categoryRefs, videoCategories, scrollingManually, setActiveCategory }) => {
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (scrollingManually) return;

                let bestMatch = null;
                let fallbackTop = Number.POSITIVE_INFINITY;
                let fallbackSlug = null;

                for (const entry of entries) {
                    const el = entry.target;
                    const slug = Object.entries(categoryRefs.current).find(([_, val]) => val === el)?.[0];

                    const top = el.getBoundingClientRect().top;

                    // основне: видимі
                    if (entry.isIntersecting) {
                        if (!bestMatch || entry.intersectionRatio > bestMatch.intersectionRatio) {
                            bestMatch = entry;
                        }
                    }

                    // fallback: найвище вікно
                    if (top < fallbackTop && top > 0 && slug) {
                        fallbackTop = top;
                        fallbackSlug = slug;
                    }
                }

                if (bestMatch) {
                    const visibleCategory = videoCategories.find(
                        (category) => categoryRefs.current[category.slug] === bestMatch.target
                    );
                    if (visibleCategory) {
                        setActiveCategory(visibleCategory.slug);
                    }
                } else if (fallbackSlug) {
                    setActiveCategory(fallbackSlug);
                }
            },
            {
                rootMargin: "-5% 0px -85% 0px", // менша межа знизу
                threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1],
            }
        );

        videoCategories.forEach((category) => {
            const el = categoryRefs.current[category.slug];
            if (el) observer.current.observe(el);
        });

        return () => observer.current && observer.current.disconnect();
    }, [videoCategories.map(c => c.slug).join(","), scrollingManually]);
};

export default useCategoryObserver;
