import { getFeedsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';
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
