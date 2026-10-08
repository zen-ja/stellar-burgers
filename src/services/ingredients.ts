import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

//#region Ingredients
export type IngredientsState = {
  isInit: boolean;
  isLoading: boolean;
  ingredients: TIngredient[];
  error: SerializedError | null;
};

export const getIngredientsThunk = createAsyncThunk('ingredients/getIngredients', () =>
  getIngredientsApi()
);

const initialIngredientsState: IngredientsState = {
  isInit: false,
  isLoading: false,
  ingredients: [],
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredientsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getIngredientsThunk.rejected, (state) => {
      state.isInit = true;
      state.isLoading = false;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isInit = true;
      state.isLoading = false;
      state.ingredients = payload;
    });
  },
});
//#endregion
