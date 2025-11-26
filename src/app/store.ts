// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employees/employeeSlice';
import departmentReducer from '../features/departments/departmentSlice';
import leaveReducer from '../features/leaves/leaveSlice';
import authReducer from '../features/auth/authSlice';
import toastReducer from '../features/toast/toastSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    departments: departmentReducer,
    leaves: leaveReducer,
    auth: authReducer,
    toast: toastReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


