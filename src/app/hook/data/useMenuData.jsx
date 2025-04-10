"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setParams } from "@/redux/slices/paramsSlice";
import { setMenuData } from "@/redux/slices/menuSlice";
import axiosBackendApi from "@/utils/api";

const useMenuData = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const urlSlug = params?.slug;
    const urlTableId = params?.table_id;

    const { slug, table_id } = useSelector((state) => state.params);
    const menuDataFromStore = useSelector((state) => state.menu.data);

    const [loading, setLoading] = useState(!menuDataFromStore);
    const [menuEndpoint, setMenuEndpoint] = useState(null);
    const [error, setError] = useState(null);

    const urlHasParams = urlSlug || urlTableId;
    const storeHasParams = slug || table_id;

    // Зберігаємо параметри з URL у Redux, якщо вони ще не збережені
    useEffect(() => {
        if (urlHasParams && !storeHasParams) {
            dispatch(setParams({ slug: urlSlug, table_id: urlTableId }));
        }
    }, [urlSlug, urlTableId, storeHasParams, urlHasParams, dispatch]);

    const fetchMenuData = useCallback(async () => {
        try {
            // Отримуємо токен відвідувача
            const tokenResponse = await axiosBackendApi.get('/visitor-token');
            localStorage.setItem('access_token', tokenResponse.data.access_token);

            // Формуємо endpoint залежно від параметрів
            const endpoint = table_id
                ? `/menu/by_table/${table_id}`
                : `/menu/by_restaurant/${slug}`;

            setMenuEndpoint(endpoint);

            // Отримуємо меню
            const { data } = await axiosBackendApi.get(endpoint);

            // Зберігаємо дані у Redux
            dispatch(setMenuData({ data, endpoint }));
        } catch (err) {
            console.error("Помилка при отриманні меню:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [slug, table_id, dispatch]);

    useEffect(() => {

        if (storeHasParams && !menuDataFromStore) {
            (async () => {
                await fetchMenuData();
            })();
        } else {
            setLoading(false);
        }
    }, [storeHasParams, menuDataFromStore, fetchMenuData]);



    return { menuData: menuDataFromStore, loading, menuEndpoint, error };
};

export default useMenuData;
