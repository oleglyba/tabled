const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "";

export const transformMediaUrl = (url) => {
    if (!url || typeof url !== "string") return "";

    // Не чіпати іконки або абсолютні шляхи
    if (url.startsWith("/icon/") || url.startsWith("/assets/") || url.startsWith("http")) {
        return url;
    }

    // Для всіх інших — підставити MEDIA_BASE_URL і замінити /static/ на /assets/
    let fullUrl = url;
    if (url.startsWith("/")) {
        fullUrl = `${MEDIA_BASE_URL}${url}`;
    }

    return fullUrl.replace("/static/", "/assets/");
};
