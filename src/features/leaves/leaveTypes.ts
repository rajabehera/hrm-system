// src/features/leaves/leaveTypes.ts

export enum LeaveType {
  SICK = 'sick',
  VACATION = 'vacation',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  BEREAVEMENT = 'bereavement',
  UNPAID = 'unpaid'
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  reviewComments?: string;
  numberOfDays: number;
}

export interface LeaveState {
  leaves: LeaveRequest[];
  loading: boolean;
  error: string | null;
  selectedLeave: LeaveRequest | null;
}

export interface CreateLeaveRequest {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveRequest {
  id: string;
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export interface ReviewLeaveRequest {
  id: string;
  reviewedBy: string;
  reviewComments?: string;
}