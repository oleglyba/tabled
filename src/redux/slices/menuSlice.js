// menuSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
    endpoint: null,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setMenuData: (state, action) => {
            state.data = action.payload.data;
            state.endpoint = action.payload.endpoint;
        },
        clearMenuData: (state) => {
            state.data = null;
            state.endpoint = null;
        }
    },
});

export const { setMenuData, clearMenuData } = menuSlice.actions;
export default menuSlice.reducer;
