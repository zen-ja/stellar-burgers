import type { RootState } from './store';
import type { TUser } from '@/utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

export const selectUser = (state: RootState): TUser | null => state.secure.user;

export const selectIsAuthChecked = (state: RootState): boolean =>
  state.secure.isAuthChecked;

export const selectSecureError = (state: RootState): SerializedError | null =>
  state.secure.error;
