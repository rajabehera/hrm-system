// src/features/employees/employeeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from './employeeTypes';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1234567890',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 85000,
      hireDate: '2022-01-15',
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@company.com',
      phone: '+1234567892',
      department: 'HR',
      position: 'HR Specialist',
      salary: 60000,
      hireDate: '2023-03-10',
      status: 'on-leave'
    },
    {
      id: '3',
      firstName: 'Raja',
      lastName: 'Behera',
      email: 'rajabehera@volovo.com',
      phone: '8600820649',
      department: 'IT',
      position: 'Senior Software Engineer Javascript',
      salary: 600000,
      hireDate: '2025-12-12',
      status: 'active'
    }
  ],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee, setLoading, setError } = employeeSlice.actions;
export default employeeSlice.reducer;