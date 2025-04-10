import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    slug: null,
    table_id: null,
};

const paramsSlice = createSlice({
    name: 'params',
    initialState,
    reducers: {
        setParams: (state, action) => {
            const { slug, table_id } = action.payload;
            console.log("Setting params:", { slug, table_id });
            state.slug = slug;
            state.table_id = table_id;
            console.log("New params state:", state);
        },
    },
});

export const { setParams } = paramsSlice.actions;
export default paramsSlice.reducer;
