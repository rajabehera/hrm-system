// src/features/leaves/leaveSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaveRequest, LeaveState, LeaveStatus, LeaveType, CreateLeaveRequest } from './leaveTypes';
import { RootState } from '../../app/store';

const initialState: LeaveState = {
  leaves: [],
  loading: false,
  error: null,
  selectedLeave: null
};

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    addLeave: (state, action: PayloadAction<LeaveRequest>) => {
      state.leaves.push(action.payload);
    },
    
    // Add this new action if you need to create leave requests differently
    addLeaveRequest: (state, action: PayloadAction<CreateLeaveRequest>) => {
      const newLeave: LeaveRequest = {
        id: Date.now().toString(),
        ...action.payload,
        status: LeaveStatus.PENDING,
        appliedOn: new Date().toISOString(),
        numberOfDays: calculateNumberOfDays(action.payload.startDate, action.payload.endDate)
      };
      state.leaves.push(newLeave);
    },
    
    updateLeave: (state, action: PayloadAction<LeaveRequest>) => {
      const index = state.leaves.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.leaves[index] = action.payload;
      }
    },
    
    deleteLeave: (state, action: PayloadAction<string>) => {
      state.leaves = state.leaves.filter(l => l.id !== action.payload);
    },
    
    approveLeave: (state, action: PayloadAction<{
      id: string;
      reviewedBy: string;
      reviewComments?: string;
    }>) => {
      const leave = state.leaves.find(l => l.id === action.payload.id);
      if (leave) {
        leave.status = LeaveStatus.APPROVED;
        leave.reviewedBy = action.payload.reviewedBy;
        leave.reviewedOn = new Date().toISOString();
        leave.reviewComments = action.payload.reviewComments;
      }
    },
    
    rejectLeave: (state, action: PayloadAction<{
      id: string;
      reviewedBy: string;
      reviewComments?: string;
    }>) => {
      const leave = state.leaves.find(l => l.id === action.payload.id);
      if (leave) {
        leave.status = LeaveStatus.REJECTED;
        leave.reviewedBy = action.payload.reviewedBy;
        leave.reviewedOn = new Date().toISOString();
        leave.reviewComments = action.payload.reviewComments;
      }
    },
    
    cancelLeave: (state, action: PayloadAction<string>) => {
      const leave = state.leaves.find(l => l.id === action.payload);
      if (leave && leave.status === LeaveStatus.PENDING) {
        leave.status = LeaveStatus.CANCELLED;
      }
    },
    
    setSelectedLeave: (state, action: PayloadAction<LeaveRequest | null>) => {
      state.selectedLeave = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

// Helper function to calculate number of days between dates
const calculateNumberOfDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
};

// Selectors using RootState
export const selectAllLeaves = (state: RootState) => state.leaves.leaves;

export const selectPendingLeaves = (state: RootState) =>
  state.leaves.leaves.filter(leave => leave.status === LeaveStatus.PENDING);

export const selectApprovedLeaves = (state: RootState) =>
  state.leaves.leaves.filter(leave => leave.status === LeaveStatus.APPROVED);

export const selectLeavesByEmployee = (state: RootState, employeeId: string) =>
  state.leaves.leaves.filter(leave => leave.employeeId === employeeId);

export const selectLeaveStats = (state: RootState) => {
  const leaves = state.leaves.leaves;
  
  return {
    total: leaves.length,
    pending: leaves.filter(l => l.status === LeaveStatus.PENDING).length,
    approved: leaves.filter(l => l.status === LeaveStatus.APPROVED).length,
    rejected: leaves.filter(l => l.status === LeaveStatus.REJECTED).length,
    cancelled: leaves.filter(l => l.status === LeaveStatus.CANCELLED).length,
    byType: Object.values(LeaveType).reduce((acc, type) => {
      acc[type] = leaves.filter(l => l.leaveType === type).length;
      return acc;
    }, {} as Record<LeaveType, number>)
  };
};

// Export all actions including the new addLeaveRequest
export const {
  addLeave,
  addLeaveRequest, // Now this is exported
  updateLeave,
  deleteLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  setSelectedLeave,
  setLoading,
  setError,
  clearError
} = leaveSlice.actions;

export default leaveSlice.reducer;