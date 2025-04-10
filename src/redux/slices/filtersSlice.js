import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [

    ],
    attributes: [
        { id: 1, name: 'New', isChecked: false, hasInfo: false },
        { id: 2, name: 'Vegetarian', isChecked: false, hasInfo: true, infoContent: 'A vegetarian dish contains no meat.' },
        { id: 3, name: 'Allergen', isChecked: false, hasInfo: true, infoContent: 'This item may contain allergens.' }
    ]
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        toggleCategory: (state, action) => {
            const category = state.categories.find(cat => cat.id === action.payload);
            if (category) {
                category.isChecked = !category.isChecked;
            }
        },
        selectAllCategories: (state) => {
            const allChecked = state.categories.every(cat => cat.isChecked);
            state.categories.forEach(cat => (cat.isChecked = !allChecked));
        },
        toggleAttribute: (state, action) => {
            const attribute = state.attributes.find(attr => attr.id === action.payload);
            if (attribute) {
                attribute.isChecked = !attribute.isChecked;
            }
        },
        resetFilters: (state) => {
            state.categories.forEach(cat => (cat.isChecked = false));
            state.attributes.forEach(attr => (attr.isChecked = false));
        },
        updateFilters: (state, action) => {
            state.categories = action.payload.categories;
            state.attributes = action.payload.attributes;
        }
    }
});

export const { toggleCategory, selectAllCategories, toggleAttribute, resetFilters, updateFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
