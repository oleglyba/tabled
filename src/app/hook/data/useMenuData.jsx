"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setParams } from "@/redux/slices/paramsSlice";
import { setMenuData } from "@/redux/slices/menuSlice";
import { hydrateCart, loadCartFromStorage } from "@/redux/slices/cartSlice";
import axiosBackendApi from "@/utils/api";

const useMenuData = () => {
    const dispatch = useDispatch();
    const { slug: urlSlug, table_id: urlTableId } = useParams();

    const { slug, table_id } = useSelector((s) => s.params);
    const menuData = useSelector((s) => s.menu.data);

    const [loading, setLoading] = useState(!menuData);
    const [error, setError] = useState(null);

    // 1️⃣ Sync URL → Redux params
    useEffect(() => {
        if (
            (urlSlug || urlTableId) &&
            (slug !== urlSlug || table_id !== urlTableId)
        ) {
            dispatch(setParams({ slug: urlSlug, table_id: urlTableId }));
        }
    }, [urlSlug, urlTableId, slug, table_id, dispatch]);

    // 2️⃣ Fetch menu once per slug/table_id
    const fetchMenuData = useCallback(async () => {
        setLoading(true);
        try {
            // visitor token
            const tk = await axiosBackendApi.get("/visitor-token");
            localStorage.setItem("access_token", tk.data.access_token);

            const endpoint = table_id
                ? `/menu/by_table/${table_id}`
                : `/menu/by_restaurant/${slug}`;

            const res = await axiosBackendApi.get(endpoint);
            dispatch(setMenuData({ data: res.data, endpoint }));
        } catch (err) {
            console.error("Error fetching menu:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [slug, table_id, dispatch]);

    useEffect(() => {
        if (!slug && !table_id) {
            setLoading(false);
            return;
        }
        if (menuData) {
            setLoading(false);
            return;
        }
        fetchMenuData();
    }, [slug, table_id, menuData, fetchMenuData]);

    // 3️⃣ Hydrate cart once menu is loaded
    useEffect(() => {
        if (slug && menuData) {
            const restored = loadCartFromStorage(slug);
            // expected shape is { [slug]: [ ...items ] }
            dispatch(hydrateCart({ [slug]: restored }));
        }
    }, [slug, menuData, dispatch]);

    return { menuData, loading, error };
};

export default useMenuData;
