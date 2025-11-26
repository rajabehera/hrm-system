// src/features/auth/authTypes.ts

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Mock users for demo
export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@company.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    email: 'manager@company.com',
    firstName: 'Manager',
    lastName: 'Smith',
    role: UserRole.MANAGER
  },
  {
    id: '3',
    username: 'employee',
    password: 'employee123',
    email: 'employee@company.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.EMPLOYEE
  }
];