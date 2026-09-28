import { getFeedsApi, getIngredientsApi } from '@/utils/burger-api';
import {
  combineReducers,
  createAsyncThunk,
  createSlice,
  type PayloadAction,
  type SerializedError,
} from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
  TOrder,
  TUser,
} from '@/utils/types';

export type AppState = {
  isInit: boolean;
  isLoading: boolean;
  ingredients: TIngredient[];
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: SerializedError | null;
  constructorItems: TConstructorState;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const getIngredientsThunk = createAsyncThunk('ingredients/getIngredients', () =>
  getIngredientsApi()
);

export const getFeedsApiThunk = createAsyncThunk('ingredients/getFeeds', () =>
  getFeedsApi()
);

const initialState: AppState = {
  isInit: false,
  isLoading: false,
  ingredients: [],
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // getIngredient: (id:number) =>{
    // }
    addIngredient: (state, { payload }: PayloadAction<TIngredient>) => {
      if (payload.type === 'bun') {
        state.constructorItems.bun = { id: payload._id, ...payload };
      } else {
        state.constructorItems.ingredients.push({ id: crypto.randomUUID(), ...payload });
      }
    },
    removeInggredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients = state.constructorItems.ingredients.filter(
        (i) => i.id !== payload.id
      );
    },
  },
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

    builder.addCase(getFeedsApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedsApiThunk.rejected, (state) => {
      state.isInit = true;
      state.isLoading = false;
    });
    builder.addCase(getFeedsApiThunk.fulfilled, (state, { payload }) => {
      state.orders = payload.orders;
      state.total = payload.total;
      state.totalToday = payload.totalToday;
    });
  },
});

export type SecureState = {
  user: TUser;
  isInit: boolean;
};

const secureInitialState: SecureState = {
  user: { name: 'yyy', email: 'sdfsdf@dsdfsdf.ttt' },
  isInit: false,
};

export const secureSlice = createSlice({
  name: 'secure',
  initialState: secureInitialState,
  reducers: {},
});

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  secure: secureSlice.reducer,
});

export const { addIngredient, removeInggredient } = ingredientsSlice.actions;
