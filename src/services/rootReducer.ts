import { getFeedsApi, getIngredientsApi } from "@/utils/burger-api";
import type { TIngredient, TOrder } from "@/utils/types";
import { combineReducers, createAsyncThunk, createSlice, type SerializedError } from "@reduxjs/toolkit";

export interface AppState {
  isInit: boolean;
  isLoading: boolean;
  ingredients: TIngredient[];
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: SerializedError | null;
}

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  () =>
    getIngredientsApi(),
);

export const getFeedsApiThunk = createAsyncThunk(
  'ingredients/getFeeds',
  () =>
    getFeedsApi(),
)

const initialState: AppState = {
  isInit: false,
  isLoading: false,
  ingredients: [],
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
}

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // getIngredient: (id:number) =>{

    // }
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getIngredientsThunk.rejected, (state) => {
      state.isInit = true;
      state.isLoading = false;
      state.error = state.error;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isInit = true;
      state.isLoading = false;
      state.ingredients = payload;
    });

    builder.addCase(getFeedsApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedsApiThunk.rejected, (state) => {
      state.isInit = true;
      state.isLoading = false;
      state.error = state.error;
    });
    builder.addCase(getFeedsApiThunk.fulfilled, (state, { payload }) => {
      state
      state.orders = payload.orders;
      state.total = payload.total;
      state.totalToday = payload.totalToday;
    });
  },
})

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
});