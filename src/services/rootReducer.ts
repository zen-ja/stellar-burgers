import { getIngredientsApi } from "@/utils/burger-api";
import type { TIngredient } from "@/utils/types";
import { combineReducers, createAsyncThunk, createSlice, type SerializedError } from "@reduxjs/toolkit";

// TODO: Заменить на настоящий корневой редьюсер
export const rootReducer_ = (): Record<string, never> => ({
  // TODO: Собрать здесь редьюсеры слайсов
});

export interface AppState {
  isInit: boolean;
  isLoading: boolean;
  ingredients: TIngredient[] ;
  error: SerializedError | null ;
}

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  () =>
    getIngredientsApi(),
)


const initialState: AppState = {
  isInit: false,
  isLoading: false,
  ingredients: [],
  error: null
}
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
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
  },
})

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
});