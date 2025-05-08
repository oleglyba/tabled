import { useEffect, useRef } from "react";

const useCategoryObserver = ({
                                 categoryRefs,
                                 videoCategories,
                                 scrollingManually,
                                 setActiveCategory
                             }) => {
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (scrollingManually) return;

                let best = null;
                let fallback = { top: Infinity, slug: null };

                entries.forEach((entry) => {
                    const el = entry.target;
                    const slug = Object.keys(categoryRefs.current).find(
                        (key) => categoryRefs.current[key] === el
                    );
                    const top = el.getBoundingClientRect().top;

                    if (entry.isIntersecting) {
                        if (!best || entry.intersectionRatio > best.intersectionRatio) {
                            best = { entry, slug };
                        }
                    }

                    if (top > 0 && top < fallback.top && slug) {
                        fallback = { top, slug };
                    }
                });

                if (best) {
                    setActiveCategory(best.slug);
                } else if (fallback.slug) {
                    setActiveCategory(fallback.slug);
                }
            },
            {
                rootMargin: "-5% 0px -85% 0px",
                threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1],
            }
        );

        // observe each category section
        videoCategories.forEach((cat) => {
            const el = categoryRefs.current[cat.slug];
            if (el) observer.current.observe(el);
        });

        return () => observer.current.disconnect();
    }, [videoCategories, scrollingManually, setActiveCategory, categoryRefs]);
};

export default useCategoryObserver;
