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
  
  // Find largest department by employee count
  const largestDepartment = departments.length > 0
    ? departments.reduce((largest, dept) => 
        dept.employeeCount > largest.employeeCount ? dept : largest
      )
    : null;
  
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  
  return {
    totalDepartments: departments.length,
    totalEmployees,
    totalBudget: departments.reduce((sum, dept) => sum + dept.budget, 0),
    activeDepartments: departments.filter(dept => dept.status === 'active').length,
    inactiveDepartments: departments.filter(dept => dept.status === 'inactive').length,
    archivedDepartments: departments.filter(dept => dept.status === 'archived').length,
    averageBudgetPerEmployee: totalEmployees > 0 
      ? departments.reduce((sum, dept) => sum + dept.budget, 0) / totalEmployees
      : 0,
    averageEmployeesPerDept: departments.length > 0
      ? totalEmployees / departments.length
      : 0,
    largestDepartment
  };
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