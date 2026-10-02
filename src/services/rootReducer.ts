import {
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
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
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;

        if (item.type === 'bun') {
          state.constructorItems.bun = item;
        } else {
          state.constructorItems.ingredients = [
            ...state.constructorItems.ingredients,
            item,
          ];
        }
      },
      prepare: (item: TIngredient) => {
        return {
          payload: {
            id: crypto.randomUUID().toString(),
            ...item,
          },
        };
      },
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
  // extraReducers: (builder) => {
  //   builder.addCase(orderBurgerThunk.fulfilled, (state) => {
  //     state.constructorItems = { bun: null, ingredients: [] };
  //   });
  // },
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

export const getOrdersApiThunk = createAsyncThunk('orders/getAll', async () => {
  const orders = await getOrdersApi();
  return orders;
});

export const getOrderByNumberApiThunk = createAsyncThunk(
  'orders/getByNumber',
  async (number: number) => {
    const order = await getOrderByNumberApi(number);
    return order;
  }
);

export const orderBurgerThunk = createAsyncThunk(
  'orders/create',
  async (constructorItems: TConstructorState, { dispatch }) => {
    const data = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun?._id,
    ].filter((id): id is string => Boolean(id));
    const result = await orderBurgerApi(data);
    dispatch(resetConstructor());
    return result;
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

    builder.addCase(getOrdersApiThunk.pending, (state) => {
      state.orderRequest = false;
    });
    builder.addCase(getOrdersApiThunk.rejected, (state, { error }) => {
      state.orderRequest = false;
      state.error = error;
    });
    builder.addCase(getOrdersApiThunk.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.orders = payload;
    });

    builder.addCase(getOrderByNumberApiThunk.pending, (state) => {
      state.orderRequest = false;
    });
    builder.addCase(getOrderByNumberApiThunk.rejected, (state, { error }) => {
      state.orderRequest = false;
      state.error = error;
    });
    builder.addCase(getOrderByNumberApiThunk.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      if (payload.success) state.orderModalData = payload.orders[0];
      else state.orderModalData = null;
    });
  },
});
//#endregion

//#region Secure
export type SecureState = {
  user: TUser | null;
  onlyUnAuth: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: SerializedError | null;
};

const secureInitialState: SecureState = {
  user: null,
  onlyUnAuth: false,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const getUserApiThunk = createAsyncThunk(
  'secure/getUser',
  (): Promise<TUser> =>
    getUserApi().then(({ user }) => {
      return user;
    })
);

export const registerUserApiThunk = createAsyncThunk(
  'secure/registerUser',
  (data: TRegisterData): Promise<TUser> =>
    registerUserApi(data).then(({ refreshToken, accessToken, user }) => {
      localStorage.setItem('refreshToken', refreshToken);
      setCookie('accessToken', accessToken);
      return user;
    })
);

export const loginUserApiThunk = createAsyncThunk(
  'secure/loginUser',
  (data: TLoginData): Promise<TUser> =>
    loginUserApi(data).then(({ refreshToken, accessToken, user }) => {
      localStorage.setItem('refreshToken', refreshToken);
      setCookie('accessToken', accessToken);
      return user;
    })
);

export const updateUserApiThunk = createAsyncThunk(
  'secure/updateUser',
  (data: TRegisterData): Promise<TUser> => updateUserApi(data).then(({ user }) => user)
);

export const logoutApiThunk = createAsyncThunk(
  'secure/logoutUser',
  (): Promise<boolean> =>
    logoutApi().then(({ success }) => {
      if (success) {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      }
      return success;
    })
);

export const secureSlice = createSlice({
  name: 'secure',
  initialState: secureInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserApiThunk.pending, (state) => {
      state.isAuthChecked = false;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserApiThunk.rejected, (state, { error }) => {
      state.isAuthChecked = true;
      state.error = error;
      state.isLoading = false;
      state.user = null;
    });
    builder.addCase(getUserApiThunk.fulfilled, (state, { payload }) => {
      state.isAuthChecked = true;
      state.isLoading = false;
      state.error = null;
      state.user = payload;
    });

    builder.addCase(registerUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUserApiThunk.rejected, (state, { error }) => {
      state.error = error;
      state.isLoading = false;
    });
    builder.addCase(registerUserApiThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.user = payload;
    });

    builder.addCase(loginUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUserApiThunk.rejected, (state, { error }) => {
      state.error = error;
      state.isLoading = false;
    });
    builder.addCase(loginUserApiThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.user = payload;
    });

    builder.addCase(updateUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserApiThunk.rejected, (state, { error }) => {
      state.error = error;
      state.isLoading = false;
    });
    builder.addCase(updateUserApiThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.user = payload;
    });

    builder.addCase(logoutApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutApiThunk.rejected, (state, { error }) => {
      state.error = error;
      state.isLoading = false;
    });
    builder.addCase(logoutApiThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      if (payload) {
        state.user = null;
      }
    });
  },
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
