const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "";

export const transformMediaUrl = (url) => {
    if (!url) return "";
    let fullUrl = url;
    if (url.startsWith("/")) {
        fullUrl = `${MEDIA_BASE_URL}${url}`;
    }
    return fullUrl.replace("/static/", "/assets/");
};
