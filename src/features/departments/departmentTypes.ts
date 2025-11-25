// src/features/departments/departmentTypes.ts

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string; // Manager's employee ID or name
  employeeCount: number;
  budget: number;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'archived';
}

export interface DepartmentStats {
  id: string;
  name: string;
  employeeCount: number;
  budget: number;
  avgSalary?: number;
  location?: string;
  status: 'active' | 'inactive' | 'archived';
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  manager?: string;
  budget: number;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateDepartmentRequest {
  id: string;
  name?: string;
  description?: string;
  manager?: string;
  budget?: number;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: 'active' | 'inactive' | 'archived';
}

export interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
  currentDepartment: Department | null;
}