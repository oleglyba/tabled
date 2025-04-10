import { createSlice } from '@reduxjs/toolkit';

const selectionSlice = createSlice({
    name: 'selection',
    initialState: [],
    reducers: {
        toggleSelection: (state, action) => {
            const id = action.payload;
            const index = state.indexOf(id);
            if (index !== -1) {
                return state.filter(item => item !== id);
            } else {
                state.push(id);
            }
        },
        removeSelection: (state, action) => {
            return state.filter(item => item !== action.payload);
        },
        clearSelection: () => []
    }
});

export const { toggleSelection, removeSelection, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
