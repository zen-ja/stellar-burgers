import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import { resetConstructor } from './rootReducer';

import type { TConstructorState, TOrder } from '@/utils/types';

//#region Orders
type OrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: SerializedError | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
};

const initialOrdersState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
};

export const getOrdersApiThunk = createAsyncThunk('orders/getAll', getOrdersApi);

export const getOrderByNumberApiThunk = createAsyncThunk(
  'orders/getByNumber',
  getOrderByNumberApi
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
      state.orderModalData = null;
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
      state.error = null;
      state.orderByNumber = null;
    });
    builder.addCase(getOrderByNumberApiThunk.rejected, (state, { error }) => {
      state.error = error;
      state.orderByNumber = null;
    });
    builder.addCase(getOrderByNumberApiThunk.fulfilled, (state, { payload }) => {
      const order = payload.success ? payload.orders[0] : undefined;
      state.orderByNumber = order ?? null;
    });
  },
});
//#endregion
