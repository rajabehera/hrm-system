// src/features/employees/employeeTypes.ts
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
}
export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment?: string;
  budget: number;
  employeeCount: number;
  location: string;
  createdAt: string;
}