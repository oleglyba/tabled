import { useState, useEffect } from 'react';

const useTranslations = (selectedLanguage) => {
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        if (selectedLanguage) {
            fetch(`/locales/${selectedLanguage.toLowerCase()}/translation.json`)
                .then((response) => response.json())
                .then((data) => setTranslations(data))
                .catch((error) => console.error('Error loading language file:', error));
        }
    }, [selectedLanguage]);

    return translations;
};

export default useTranslations;
