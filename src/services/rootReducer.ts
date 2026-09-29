import { getFeedsApi, getIngredientsApi, orderBurgerApi } from '@/utils/burger-api';
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

//#region Feeds
export type FeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: SerializedError | null;
  isLoading: boolean;
};

export const getFeedsApiThunk = createAsyncThunk('feeds/getFeeds', () => getFeedsApi());

const initialFeedsState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  isLoading: false,
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState: initialFeedsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeedsApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedsApiThunk.rejected, (state, { error }) => {
      state.error = error;
      state.isLoading = false;
    });
    builder.addCase(getFeedsApiThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.orders = payload.orders;
      state.total = payload.total;
      state.totalToday = payload.totalToday;
    });
  },
});
//#endregion

//#region Constructor
export type ConstructorState = {
  constructorItems: TConstructorState;
};

const initialConstructorState: ConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
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
    resetConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
    },
  },
});
//#endregion

//#region Orders
type OrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: SerializedError | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialOrdersState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  orderRequest: false,
  orderModalData: null,
};

export const orderBurgerThunk = createAsyncThunk(
  'orders/create',
  (ingredients: TConstructorIngredient[]) => {
    const data = ingredients.map((i) => i._id);
    return orderBurgerApi(data);
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrdersState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurgerThunk.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(orderBurgerThunk.rejected, (state, { error }) => {
      state.orderRequest = false;
      state.error = error;
    });
    builder.addCase(orderBurgerThunk.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.orderModalData = payload.order;
    });
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
  isInit: true,
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
  orders: ordersSlice.reducer,
  feeds: feedsSlice.reducer,
});

export const {
  addIngredient,
  removeIngredient,
  upIngredient,
  downIngredient,
  resetConstructor,
} = constructorSlice.actions;

export const { clearOrderModal } = ordersSlice.actions;
