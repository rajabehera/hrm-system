
// src/features/toast/toastSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Toast, ToastState, ToastType } from './toastTypes';
import { RootState } from '../../app/store';

const initialState: ToastState = {
  toasts: []
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        id: Date.now().toString(),
        ...action.payload
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    }
  }
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;

export default toastSlice.reducer;

// Selectors
export const selectAllToasts = (state: RootState) => state.toast.toasts;

// Helper action creators
export const showSuccessToast = (message: string) => 
  addToast({ message, type: ToastType.SUCCESS, duration: 3000 });

export const showErrorToast = (message: string) => 
  addToast({ message, type: ToastType.ERROR, duration: 5000 });

export const showInfoToast = (message: string) => 
  addToast({ message, type: ToastType.INFO, duration: 3000 });

export const showWarningToast = (message: string) => 
  addToast({ message, type: ToastType.WARNING, duration: 4000 });