// src/features/departments/departmentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Department, DepartmentState } from './departmentTypes';

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
  currentDepartment: null
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter(d => d.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentDepartment: (state, action: PayloadAction<Department | null>) => {
      state.currentDepartment = action.payload;
    }
  }
});

// Selectors
export const selectDepartmentStats = (state: { departments: DepartmentState }) => {
  const departments = state.departments.departments;
  
  return departments.map(dept => ({
    id: dept.id,
    name: dept.name,
    employeeCount: dept.employeeCount,
    budget: dept.budget,
    location: dept.location,
    status: dept.status,
    description: dept.description,
    // Calculate budget per employee
    budgetPerEmployee: dept.employeeCount > 0 ? dept.budget / dept.employeeCount : 0,
    // Add any other calculated stats you need
  }));
};

export const selectActiveDepartments = (state: { departments: DepartmentState }) =>
  state.departments.departments.filter(dept => dept.status === 'active');

export const selectDepartmentById = (state: { departments: DepartmentState }, departmentId: string) =>
  state.departments.departments.find(dept => dept.id === departmentId);

export const { 
  addDepartment, 
  updateDepartment, 
  deleteDepartment, 
  setLoading, 
  setError, 
  setCurrentDepartment 
} = departmentSlice.actions;

export default departmentSlice.reducer;