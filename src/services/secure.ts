import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TUser } from '@/utils/types';

export type SecureState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: SerializedError | null;
};

const secureInitialState: SecureState = {
  user: null,
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
