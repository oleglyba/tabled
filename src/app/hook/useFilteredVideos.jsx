import { useMemo } from "react";

const useFilteredVideos = (categories, searchQuery, translations, filters) => {
    return useMemo(() => {
        if (!categories) return [];

        // Збираємо всі відео (товари) з усіх категорій
        let allVideos = categories.flatMap((cat) => cat.menu_items || []);

        // Фільтр по пошуку
        let result = allVideos.filter((video) => {
            const translatedName = translations[video.name] || video.name;
            return translatedName.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Фільтр по атрибутах (vegetarian, new тощо)
        const activeAttrFilters = filters.attributes.filter((attr) => attr.isChecked);
        if (activeAttrFilters.length > 0) {
            activeAttrFilters.forEach((attr) => {
                const key = attr.name.toLowerCase();
                result = result.filter((video) => video[key]);
            });
        }

        return result;
    }, [categories, searchQuery, translations, filters]);
};

export default useFilteredVideos;
