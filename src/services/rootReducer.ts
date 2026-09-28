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

//#region Ingredients
export type AppState = {
  isInit: boolean;
  isLoading: boolean;
  ingredients: TIngredient[];
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: SerializedError | null;
};

export const getIngredientsThunk = createAsyncThunk('ingredients/getIngredients', () =>
  getIngredientsApi()
);

export const getFeedsApiThunk = createAsyncThunk('ingredients/getFeeds', () =>
  getFeedsApi()
);

const initialAppState: AppState = {
  isInit: false,
  isLoading: false,
  ingredients: [],
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialAppState,
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

    // builder.addCase(getFeedsApiThunk.pending, (state) => {
    //   state.ordersLoading = true;
    //   state.ordersError = null;
    // });
    // builder.addCase(getFeedsApiThunk.rejected, (state, { error }) => {
    //   state.ordersLoading = false;
    //   state.ordersError = error;
    // });
    // builder.addCase(getFeedsApiThunk.fulfilled, (state, { payload }) => {
    //   state.ordersLoading = false;
    //   state.orders = payload.orders;
    //   state.total = payload.total;
    //   state.totalToday = payload.totalToday;
    // });
  },
});
//#endregion

//#region Constructor
export type ConstructorState = {
  constructorItems: TConstructorState;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialConstructorState: ConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructorState,
  reducers: {
    addIngredient: (state, { payload }: PayloadAction<TIngredient>) => {
      if (payload.type === 'bun') {
        state.constructorItems.bun = { id: payload._id, ...payload };
      } else {
        state.constructorItems.ingredients.push({ id: crypto.randomUUID(), ...payload });
      }
    },
    removeIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients = state.constructorItems.ingredients.filter(
        (i) => i.id !== payload.id
      );
    },
    upIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === payload.id
      );
      state.constructorItems.ingredients = [
        ...state.constructorItems.ingredients.slice(0, index - 1),
        state.constructorItems.ingredients[index],
        state.constructorItems.ingredients[index - 1],
        ...state.constructorItems.ingredients.slice(index + 1),
      ];
    },
    downIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === payload.id
      );
      state.constructorItems.ingredients = [
        ...state.constructorItems.ingredients.slice(0, index),
        state.constructorItems.ingredients[index + 1],
        state.constructorItems.ingredients[index],
        ...state.constructorItems.ingredients.slice(index + 2),
      ];
    },
  },
});
//#endregion

//#region Secure
export type SecureState = {
  user: TUser;
  isInit: boolean;
};

const secureInitialState: SecureState = {
  user: { name: 'uuu', email: 'sdfsdf@dsdfsdf.ttt' },
  isInit: false,
};

export const secureSlice = createSlice({
  name: 'secure',
  initialState: secureInitialState,
  reducers: {},
});
//#endregion

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  secure: secureSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
});

export const { addIngredient, removeIngredient, upIngredient, downIngredient } =
  constructorSlice.actions;
